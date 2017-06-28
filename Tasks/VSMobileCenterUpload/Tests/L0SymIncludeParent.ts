
import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import fs = require('fs');
var Readable = require('stream').Readable
var Writable = require('stream').Writable
var Stats = require('fs').Stats

var nock = require('nock');

let taskPath = path.join(__dirname, '..', 'vsmobilecenterupload.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('serverEndpoint', 'MyTestEndpoint');
tmr.setInput('appSlug', 'testuser/testapp');
tmr.setInput('app', '/test/path/to/my.ipa');
tmr.setInput('releaseNotesSelection', 'releaseNotesInput');
tmr.setInput('releaseNotesInput', 'my release notes');
tmr.setInput('symbolsType', 'AndroidJava');
tmr.setInput('mappingTxtPath', '/test/path/to/mappings.txt');
tmr.setInput('packParentFolder', 'true');

//prepare upload
nock('https://example.test')
    .post('/v0.1/apps/testuser/testapp/release_uploads')
    .reply(201, {
        upload_id: 1,
        upload_url: 'https://example.upload.test/release_upload'
    });

//upload 
nock('https://example.upload.test')
    .post('/release_upload')
    .reply(201, {
        status: 'success'
    });

//finishing upload, commit the package
nock('https://example.test')
    .patch('/v0.1/apps/testuser/testapp/release_uploads/1', {
        status: 'committed'
    })
    .reply(200, {
        release_url: 'my_release_location' 
    });

//make it available
nock('https://example.test')
    .patch('/my_release_location', {
        status: 'available',
        distribution_group_id:'00000000-0000-0000-0000-000000000000',
        release_notes:'my release notes'
    })
    .reply(200);

//begin symbol upload
nock('https://example.test')
    .post('/v0.1/apps/testuser/testapp/symbol_uploads', {
        symbol_type: 'AndroidJava'
    })
    .reply(201, {
        symbol_upload_id: 100,
        upload_url: 'https://example.upload.test/symbol_upload',
        expiration_date: 1234567
    });

//upload symbols
nock('https://example.upload.test')
    .put('/symbol_upload')
    .reply(201, {
        status: 'success'
    });

//finishing symbol upload, commit the symbol 
nock('https://example.test')
    .patch('/v0.1/apps/testuser/testapp/symbol_uploads/100', {
        status: 'committed'
    })
    .reply(200);

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    'checkPath' : {
        '/test/path/to/my.ipa': true,
        '/test/path/to/mappings.txt': true,
        '/test/path/to': true,
        '/test/path/to/f1.txt': true,
        '/test/path/to/f2.txt': true,
        '/test/path/to/folder': true,
        '/test/path/to/folder/f11.txt': true,
        '/test/path/to/folder/f12.txt': true
    },
    'findMatch' : {
        '/test/path/to/mappings.txt': [
            '/test/path/to/mappings.txt'
        ],
        '/test/path/to/my.ipa': [
            '/test/path/to/my.ipa'
        ]
    }
};
tmr.setAnswers(a);

fs.createReadStream = (s: string) => {
    let stream = new Readable;
    stream.push(s);
    stream.push(null);

    return stream;
};

fs.createWriteStream = (s: string) => {
    let stream = new Writable;

    stream.write = () => {};

    return stream;
};

fs.readdirSync = (folder: string) => {
    let files: string[] = [];

    if (folder === '/test/path/to') {
        files = [
            'mappings.txt',
            'f1.txt',
            'f2.txt',
            'folder'
        ]
    } else if (folder === '/test/path/to/folder') {
        files = [
            'f11.txt',
            'f12.txt'
        ]
    }

    return files;
};

fs.statSync = (s: string) => {
    let stat = new Stats;
//    s = s.replace("\\", "/");

    stat.isFile = () => {
        if (s === '/test/path/to') {
            return false;
        } else if (s === '/test/path/to/folder') {
            return false;
        } else {
            return true;
        }
    }

    stat.isDirectory = () => {
        if (s === '/test/path/to') {
            return true;
        } else if (s === '/test/path/to/folder') {
            return true;
        } else {
            return false;
        }
    }

    stat.size = 100;

    return stat;
}
tmr.registerMock('fs', fs);

tmr.run();

