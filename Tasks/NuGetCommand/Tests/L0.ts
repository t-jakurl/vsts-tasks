import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'vsts-task-lib/mock-test';

describe('NuGetCommand Suite', function () {
    before(() => {
    });

    after(() => {
    });
    
    it('restore single solution', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/singlesln.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\single.sln -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('restore single solution with CredentialProvider', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/singleslnCredentialProvider.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\single.sln -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.stdout.indexOf('Got auth token') >= 0, "should have got Auth token");
        assert(tr.stdout.indexOf('credProviderPath = ') >= 0, "should have found credential provider path");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });
    
    it('restore packages.config', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/pkgconfig.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\packages.config -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });   
    
    it('restore single solution with noCache', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/singleslnNoCache.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\single.sln -NoCache -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });
    
    it('restore single solution with nuget config', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/singleslnConfigFile.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\single.sln -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet with ConfigFile specified');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('restore multiple solutions', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/multiplesln.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert(tr.invokedToolCount == 2, 'should have run NuGet twice');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\single.sln -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet on single.sln');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\double\\double.sln -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet on double.sln');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });
    
    it('restore single solution mono', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/singleslnMono.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('/usr/bin/mono c:\\from\\tool\\installer\\nuget.exe restore ~/myagent/_work/1/s/single.sln -NonInteractive -ConfigFile ~/myagent/_work/1\\tempNuGet_.config'), 'it should have run NuGet with mono');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('restore select vsts source', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/selectSourceVsts.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\packages.config -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet with a vsts source');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

        it('restore select nuget.org source', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/selectSourceNuGetOrg.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\packages.config -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet with nuget.org source');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('restore select multiple sources', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/selectSourceMultiple.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\packages.config -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet with multiple sources');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('pushes successfully to internal feed using NuGet.exe', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './PublishTests/internalFeedNuGet.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe push c:\\agent\\home\\directory\\foo.nupkg -NonInteractive -Source https://vsts/packagesource -ApiKey VSTS'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('pushes successfully to internal feed using VstsNuGetPush.exe', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './PublishTests/internalFeedVstsNuGetPush.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run VstsNuGetPush once');
        assert(tr.ran('c:\\agent\\home\\directory\\externals\\nuget\\VstsNuGetPush.exe c:\\agent\\home\\directory\\foo.nupkg -Source https://vsts/packagesource -AccessToken token -NonInteractive'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('VstsNuGetPush output here'), "should have VstsNuGetPush output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('succeeds when conflict occurs using VstsNuGetPush.exe', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './PublishTests/internalFeedVstsNuGetPushAllowConflict.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run VstsNuGetPush once');
        assert(tr.ran('c:\\agent\\home\\directory\\externals\\nuget\\VstsNuGetPush.exe c:\\agent\\home\\directory\\foo.nupkg -Source https://vsts/packagesource -AccessToken token -NonInteractive'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('VstsNuGetPush output here'), "should have VstsNuGetPush output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('succeeds when conflict occurs using VstsNuGetPush.exe', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './PublishTests/internalFeedVstsNuGetPushDisallowConflict.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run VstsNuGetPush once');
        assert(tr.ran('c:\\agent\\home\\directory\\externals\\nuget\\VstsNuGetPush.exe c:\\agent\\home\\directory\\foo.nupkg -Source https://vsts/packagesource -AccessToken token -NonInteractive'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('VstsNuGetPush output here'), "should have VstsNuGetPush output");
        assert(tr.failed, 'should have failed');
        done();
    });

    it('packs with prerelease', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './PackTests/packPrerelease.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe pack c:\\agent\\home\\directory\\foo.nuspec -NonInteractive -OutputDirectory C:\\out\\dir -version x.y.z-CI-YYYYMMDD-HHMMSS'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('packs with env var', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './PackTests/packEnvVar.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe pack c:\\agent\\home\\directory\\foo.nuspec -NonInteractive -OutputDirectory C:\\out\\dir -version XX.YY.ZZ'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('packs with build number', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './PackTests/packBuildNumber.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe pack c:\\agent\\home\\directory\\foo.nuspec -NonInteractive -OutputDirectory C:\\out\\dir -version 1.2.3'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('works with custom command happy path', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './CustomCommandTests/customHappyPath.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe these are my arguments -NonInteractive'), 'it should have run NuGet');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('restore single solution with nuget config and multiple service connections', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, './RestoreTests/multipleServiceConnections.js')
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run()
        assert(tr.invokedToolCount == 1, 'should have run NuGet once');
        assert(tr.ran('c:\\from\\tool\\installer\\nuget.exe restore c:\\agent\\home\\directory\\single.sln -NonInteractive -ConfigFile c:\\agent\\home\\directory\\tempNuGet_.config'), 'it should have run NuGet with ConfigFile specified');
        assert(tr.stdOutContained('setting console code page'), 'it should have run chcp');
        assert(tr.stdOutContained('adding token auth entry for feed https://endpoint1.visualstudio.com/path'), 'it should have added auth entry for endpoint 1');
        assert(tr.stdOutContained('adding token auth entry for feed https://endpoint2.visualstudio.com/path'), 'it should have added auth entry for endpoint 2');
        assert(tr.stdOutContained('NuGet output here'), "should have nuget output");
        assert(tr.succeeded, 'should have succeeded');
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });
});