# Bilrost v2.0.10
* 2017-10-10 #454 Amazon repo manager
* 2017-09-06 #443 Add project description to workspace resource
* 2017-10-10 #455 Remove deprecated amazon scripts
* 2017-10-12 #456 Hook s3 repo manager to resource model
* 2017-10-04 #450 Resume multipart upload
* 2017-09-26 #447 s3 access objects
* 2017-10-05 #451 Cleanup repo managers
* 2017-10-06 #452 Identity resource builder
* 2017-09-27 #448 Multipart upload
* 2017-10-16 #462 Don't pull new resources when subscribing s3 assets/resources
* 2017-09-06 #444 Rename query parameter from uri to name
* 2017-10-16 #463  s3 commit method was taking wrong input from workspace model
* 2017-10-16 #461 Fix git stage methods
* 2017-10-13 #458 Fixes for S3 repo manager integrations
* 2017-09-21 #445 Put back amazon
* 2017-09-29 #449 More updates to amazon multipart upload
* 2017-10-12 #457 S3 project builder

# Bilrost v2.0.9
* 2017-07-26 #426 Move validators to asset and resource models
* 2017-08-04 #439 Fix host url from project
* 2017-07-24 #422 Simplify asset test
* 2017-07-24 #421 remove get_settings_path because it is not used
* 2017-08-04 #437 Various fixes for git repo manager script
* 2017-07-24 #420 Reorganize files in directories
* 2017-07-21 #416 Update repo manager with new git features
* 2017-07-24 #423 always use cloud-test-project-1 in tests
* 2017-07-19 #415 Workspace declares now repo manager
* 2017-07-24 #419 Svn repo manager test
* 2017-08-02 #429 Write project properties file when creating a workspace
* 2017-08-03 #433 stores the session id in the application folder
* 2017-07-26 #424 Move repo manager to asset and resource models
* 2017-07-21 #417 Fix asset find_asset_by_ref method to be easier exposed to other objects
* 2017-07-31 #428 Migration for git storing assets and svn stocking resources
* 2017-07-26 #427 Pass workspace to constructor instead of every method
* 2017-08-03 #432 Clean up project manager
* 2017-07-17 #410 Move some methods from commit manager to utilities
* 2017-07-17 #411 Test workspace factory
* 2017-08-02 #430 Split subscription script
* 2017-08-04 #438 Fix for listing a removed asset from subscription
* 2017-08-04 #436 Return correct commit id
* 2017-07-18 #414 Mock get directories to search in namespaces
* 2017-07-21 #418 Split repo manager

# Bilrost v2.0.8
* 2017-07-14 #402 Extracts assets search_parser and moves url generation to controller
* 2017-07-12 #406 [UI] Create asset without main property
* 2017-07-10 #400 Rename Project_v2/workspace_v2 to project/workspace
* 2017-07-10 #400 Rename Project_v2/workspace_v2 to project/workspace
* 2017-07-09 #401 asset was included twice giving internal error
* 2017-07-13 #408 renames _valid to run_full_validation_and_reduce_errors
* 2017-07-07 #399 V2.0.7
* 2017-07-10 #397 Status collection integration
* 2017-07-07 #396 Status collection and its test
* 2017-07-13 #405 Asset model to functional programming paradigm
* 2017-07-12 #404 Workspace instantiates now asset object
* 2017-07-07 #398 Misc/extract output from asset

# Bilrost v2.0.7
* 2017-07-06 #395 removes force_update_workspace_id
* 2017-07-03 #374 reduces test time for the two most expensive tests
* 2017-07-04 #382 Fix workspace initialized twice in asset unit test
* 2017-07-03 #378 uses a cascade of Promises to do saves in sequence
* 2017-07-04 #381 Fix database getting closed twice when removing a workspace
* 2017-07-06 #392 Asset collection
* 2017-07-03 #375 Fix subscription tests that were wrongly expecting 500
* 2017-07-06 #393 uses test_util methods
* 2017-07-03 #376 removes the assignment of all workspace properties to Asset
* 2017-07-03 #379 Use favorite.find_by_url instead of an ad-hoc function
* 2017-07-03 #373 Valid workspace name with file name sanitizer
* 2017-07-05 #383 Update loki with collection management
* 2017-07-03 #377 Feat/introduce static method to find assets
* 2017-07-06 #391 Being able to create an empty asset
* 2017-07-03 #367 Misc/renames status to integrity status
* 2017-07-04 #387 Asset unit tests enhanced to cover searching

# Bilrost v2.0.6
* 2017-06-23 #282 uses AWS ECS to simplify script
* 2017-06-25 #341 moves favorite_search to the model favorite
* 2017-06-25 #342 moves global debug setting to mocha setup
* 2017-06-25 #343 Misc/split favorite and workspace unit test
* 2017-06-25 #346 Misc/refactor favorite unit test
* 2017-06-25 #347 Remove workspace add and forget methods
* 2017-06-26 #348 Remove ext validation for assets
* 2017-06-26 #349 Validation "path" term to "ref"
* 2017-06-26 #350 Removes get_workspace_identifiers function
* 2017-06-26 #352 allows full file URL as  workspace_id parameter
* 2017-06-27 #354 Refactor test util
* 2017-06-28 #357 Handler deep refactor
* 2017-06-28 #358 Always use file_uri  to refer to a file:///path identifier
* 2017-06-28 #359 Rename favorite url to favorite file uri
* 2017-06-29 #363 Add modified header anyways at asset creation
* 2017-06-29 #364 removes asset v1.0 dead code
* 2017-06-29 #365 Prepares validation code to avoid creating a search database
* 2017-06-30 #368 Favorite update should be reentrant
* 2017-06-30 #369 Valid should not access database directly

# Bilrost v2.0.5
* 2017-06-23 #323 Cleanup databases
* 2017-06-23 #324 Replace map flush db method with close
* 2017-06-22 #321 creates a find_by_guid in favorites
* 2017-06-23 #325 Database integration test
* 2017-06-23 #294 No more main prop required to create asset
* 2017-06-22 #319 renames object_list_presenter method
* 2017-06-23 #327 Remove asset synchronisation
* 2017-06-20 #312 extracts a populate_db and flush_db in workspace
* 2017-06-15 #301 Add new tests to cover all search posibilities
* 2017-06-19 #306 group all database initialization together
* 2017-06-21 #316 ContentBrowser controller: split workspace get and list
* 2017-06-23 #326 Remove database persistance checks
* 2017-06-22 #315 Lokijs full integration
* 2017-06-21 #313 Misc/extract workspace list
* 2017-06-12 #288 No more content type
* 2017-06-13 #290 remove list asset types from UI
* 2017-06-19 #303 cleaner layout and put flush method to search_index
* 2017-06-20 #309 Rxdb implementation
* 2017-06-13 #292 log all requests
* 2017-06-19 #304 renames database_sync to make it more distinguishable from database
* 2017-06-12 #286 Fix adding deleted files to stage
* 2017-06-09 #287 allows not specifying the branch for projects that do not have one
* 2017-06-08 #284 Feat/report error on promise rejection
* 2017-06-22 #322 Clean workspace code
* 2017-06-19 #307 Rename search index to database
* 2017-06-19 #308 Misc/move search index to databases folder
* 2017-06-21 #314 Lokijs wrapper implementation
* 2017-06-08 #285 Fix commit vcs method
* 2017-06-13 #289 Refactor validator

# Bilrost v2.0.4
* 2017-06-05 #281 Various fixes
* 2017-06-02 #278 Fix resource list dependencies
* 2017-06-05 #279 Refactoring and improving API UI

# Bilrost v2.0.3
* 2017-05-25 #271 Add nextLink to commit logs
* 2017-05-26 #272 Change get_general_status for a more complete get_full_status
* 2017-05-26 #272 Change get_general_status for a more complete get_full_status
* 2017-06-01 #277 Remove content type argument for creating assets
* 2017-06-01 #276 Add status API calls for the whole workspace and specific asset/resource refs
* 2017-05-26 #275 Clarify docs - add / in front of asset_ref

# Bilrost v2.0.2
* 2017-05-19 #267 Split workspace removal method
* 2017-05-18 #263 Remove REST version control
* 2017-05-17 #264 Move out docs from fl4re-engine
* 2017-05-23 #266 Add pagination to get_commit_log
* 2017-05-19 #265 Touch asset manager doc
* 2017-05-19 #268 Split workspace creation method
* 2017-05-22 #269 replace byline module by core readline
* 2017-05-22 #246 Create commit-related API calls

# Bilrost v2.0.1
Bilrost v2 is a breaking change development of Bilrost.

We want Bilrost v2 to be independent of Valhalla, so that it can be used with different engines
or even with no engine.

2017-05-16 #260 recursive-readdir 2.2.0 is broken, updating to 2.2.1
2017-05-15 #252 catches svn command errors, if not timeouts withour correct warning
2017-05-15 #256 Misc/cleanup handler
2017-05-11 #249 explains mocha setup
2017-05-16 #257 Misc/extract restify server customization
2017-05-09 #231 Fire exceptions in list dependencies method
2017-05-11 #235 Remove vcs
2017-05-15 #251 Remove unnecessary line on Commit_manager unit test
2017-05-04 #227 Creating Repo_manager mock
2017-05-10 #240 Remove wiki
2017-04-27 #224 Fix exec_by_line's closing condition
2017-05-10 #243 Remove Conduit wrapper
2017-05-16 #259 catch rejections to see the actual error instead of timeout
2017-05-09 #236 Refactor VCS related tests
2017-05-09 #229 Particle dependencies list
2017-05-11 #228 Creating tests for commit_manager
2017-05-10 #237 Remove am v1
2017-05-15 #239 extract common code to simplify validator dependency calls
2017-05-16 #258 Update dependencies and remove unused ones
2017-04-21 #212 Not operator to ifs/asset browse API
2017-05-03 #226 Resourceless fixtures creation
2017-04-20 #217 Add constants to centralize system-wide constants and tokens
2017-04-21 #220 # 3 Unhandled promise rejections
2017-05-17 #261 Update version_control.MD
2017-05-11 #242 Remove config
2017-05-11 #250 rename cache object to favorite
2017-05-11 #244 Remove old event bus
2017-05-09 #234 Remove cafs
2017-05-11 #248 Fix typo readdable -> readable
2017-05-10 #241 Remove "suicide" program
2017-04-21 #222 specifies a wider range of node versions
2017-05-10 #233 Remove plugin
2017-05-03 #213 Creating Commit_manager to implement VCS commit operations
2017-05-15 #255 Remove unnecessary mime types from assetmanager.js
2017-05-11 #245 Rename "contentbrowser" directory to "assetmanager"
2017-05-12 #253 Fix tests related to maya validator
2017-05-09 #232 Remove assemblymanager
2017-05-15 #254 Remove tojson
2017-04-27 #223 Create a exec_by_line module
2017-05-05 #225 Maya validator


# Bilrost v1.1.14
2017-03-27 #191 Use Subscription manager on controller calls
2017-03-28 #195 Add validation to Subscription entries
2017-03-30 #197 Add descriptor and asset validations to Subscriptions
2017-03-30 #198 Absolute material dependencies path
2017-03-31 #201 Remove rpc as a dependency for Asset and Resource
2017-04-05 #204 List assembly dependencies
2017-04-10 #199 List assets, dependencies, and pull dependencies of Subscription
2017-04-10 #210 [FIX] Add create_workspace1_file function to asset.js
2017-04-12 #206 Create Stage_manager to centralize Stage operations
2017-04-12 #208 Change workspace and project files to v2 format
2017-04-13 #207 Particle validator
2017-04-18 #214 #1 Unhandled promise rejections
2017-04-19 #215 Separate Repo_manager into two subclasses, add factory method
2017-04-19 #218 Fix shrinkwrap
2017-04-19 #219 # 2 Unhandled promise rejections
2017-04-20 #221 Use yarn instead of npm

# Bilrost v1.1.12
2017-03-21 #181 Creating Subscription Functional Tests and revising docs
2017-03-22 #185 Create Subscription related entities (factory, presenter, model)
2017-03-22 #186 Create Stringify util function with JSON.stringify sanitization
2017-03-22 #187 Assembly validator
2017-03-24 #188 Adding unit tests to Subscription
2017-03-24 #190 Remote close notif
2017-03-24 #192 Collada main dependency
2017-03-24 #193 Sanitize file name using sb registry

# Bilrost v1.1.11
2017-03-20 #180 Removing unnecessary create_fixtures from vcs.js functional test
2017-03-20 #182 Adding invalid schema bare validation to valid.js
2017-03-17 #176 Changing Repo_manager to checkout sparse Workspace
2017-03-20 #183 Changing (.*) to ([^\/]*) on assetmanager.js
2017-03-20 #178 Fix collada parser
2017-03-17 #173 Refactoring valid_asset function
2017-03-16 #177 material and collada external validation
2017-03-17 #175 Change status.js run_full_validation call to run_bare_validation

# Bilrost v1.1.10
2017-03-02 #158 Updating Browse functional tests to r27 of the svn repo
2017-02-28 #159 Merge feature branch with master
2017-03-02 #161 Updating List Dependencies to the latest svn revision
2017-03-02 #162 Updating Asset tests to last svn revision
2017-03-02 #163 Updating Asset Model test to the last svn revision
2017-03-03 #164 Updating and refactoring all unit tests that refer to -r13
2017-03-07 #165 Removing the revision argument from Test_util
2017-03-07 #166 Import remote external module
2017-03-08 #167 Adapt validator external from remote module import
2017-03-10 #168 Adding Ignore List and Subscription List entries to the VCS docs
2017-03-09 #169 Change all exec('svn checkout') calls to test_util.svn_checkout(...)
2017-03-10 #170 Renaming get_repo_folder_name for readability

# Bilrost v1.1.9
2017-02-28 #157 Updating the Workspace functional tests to r27 of the svn repo
2017-02-27 #127 Assembly external
2017-02-13 #126 Material external
2017-02-24 #135 Misc/unify bilrost configuration
2017-02-08 #121 Externals
2017-02-28 #155 Cleanup http server declarations
2017-01-31 #110 Remote event emitters
2017-02-08 #124 Pass rpc dependency to content/asset managers
2017-01-30 #106 Remote terminology
2017-02-08 #123 Better event emitter instances
2017-02-10 #122 Validator class
2017-02-28 #156 Updating the VCS tests to the newest svn repo revision
2017-02-02 #113 Remote startup script
2017-01-26  #94 Event bus
2017-01-26 #100 Remote Procedure Call

# Bilrost v1.1.8
2017-02-23 #149 Mock ifs adapter in asset and search_index_sync unit tests
2017-02-23 #152 Remove duplicated test scripts
2017-02-22 #150 Investigate mac test failures
2017-02-22 #147 catch the error if svn is not installed on users machine
2017-02-17 #139 Mock ifs adapter in list dependencies unit test
2017-02-17 #143 Adding branch parameter to test_util
2017-02-17 #140 Mock ifs adapter in valid unit test
2017-02-17 #141 Mock ifs adapter in status manager unit tests
2017-02-17 #144 Refactoring create_fixtures into multiple smaller methods
2017-02-17 #145 Updating the Status test to the most recent svn revision

# Bilrost v1.1.7
2017-02-16 #138 Fix plugin definition 
2017-02-16 #136 Mock ifs adapter in status unit test
2017-02-16 #134 Moving the checkout command from Workspace_factory to Repo_manager
2017-02-16 #133 Changing Workspace guid generation to synchronous method
2017-02-15 #131 Refactoring create_fixtures (Step 1)
2017-02-15 #137 Better error filters
2017-02-14 #132 refactor config component
2017-02-14 #129 Add LogReader to app list
2017-02-10 #128 Remove unused deps object_utils and secure-rnd

# Bilrost v1.1.6
2017-02-02 #118 Better output if supertest fails
2017-02-01 #114 node_v6 raises an error when itsProjects.json does not exist
2017-02-01 #112 new method to get usages of collada files in assemblies
2017-01-30 #108 sets test timeout relative to parent context
2017-01-27 #105 Changing Integrity Status tokens from lower case to upper case
2017-01-26 #101 Creating the regex and stubs for the VCS api calls
2017-01-26 #99 Creating functional tests for Version Control API Calls


# Bilrost v1.1.5
2017-01-25 #97 Assembly manager use svn to move files
2017-01-24 #91 reverts console.error to console.log for client connection close
2017-01-24 #96 uses an env var for node version to allow v6 tests
2017-01-23 #72 Creating /docs/api/version_control.md to conceptualize the VCS API calls
2017-01-19 #93 New websocket server object
2017-01-19 #88 Extract instance object from remote

# Bilrost v1.1.3

v1.1.3 is a patch release that only contains the following fixes:

* 2017-01-09 #85 Fix regexp handler
* 2017-01-09 #75 test_RPC_service_integrity
* 2016-12-23 #83 Fixing the POST Rename Asset call to match the future VCS API
* 2016-12-22 #78 Fixing the UI to encode the Q parameter
* 2016-12-22 #84 fixes docker script to include shrinkwrap before npm install
* 2016-12-20 #77 Adding tests for the {q} "dependency" and "tag" parameters
* 2016-12-14 #63 Material dependencies
* 2016-12-13 #73 Plugin documentation
* 2016-12-12 #70 Adding from_repo parameter to POST /assetmanager/workspace
* 2016-12-12 #69 Fixing /contentbrowser/workspaces/ to remove the trailing slash on the 'list all' call
* 2016-12-07 #68 Fixing the {q} parameter placement on CB
* 2016-12-05 #67 Fixing the border of the API UI page for better iframe integration
* 2016-12-03 #64 remove test/engine_instance.js because it is duplicated
* 2016-12-01 #58 Include collada utils
* 2016-12-01 #60 introduces a setup file that is run before mocha tests
* 2016-12-01 #61 Add {q} to API UI
* 2016-11-30 #59 Reorganize test directories
* 2016-11-29 #57 Move vh_assets to it's own repo
* 2016-11-25 #42 Create Workspaces with POST /assetmanager/workspace
* 2016-11-25     Reorganize build and test scripts
* 2016-11-23 #52 Spawn error when db folder not ignored with svn

# Bilrost v1.1.0

## Features:
* 95c70eb Merge pull request #45 from bilrost/feat/path_to_resource_stats
  GET /contentbrowser/workspace/id/resource_ref returns file path

* 4ac429c Merge pull request #41 from bilrost/feat/project_tests
  This is an example of how to test a module (in this case contentbrowser/v2/project) that requires a connection to rest3d.
  Instead of using a server we use a mock object (rest3d_client).

* 922783b Merge pull request #38 from bilrost/feat/windows_test_runner
  Adds and script to run tests in windows. It is used in https://jk1-dev1.starbreeze.com:46721/job/bilrost_build_win/

* 09f7a04 Merge pull request #25 from bilrost/feat/copy-workspace
    Create an example workspace from a fixed directory. The behaviour of POST /workspaces is:
    * if the supplied file_uri points to an existing directory, this should be an already initialized workspace, then validate and add.
    * if file_uri doesn't exist, then create a new workspace from the fixed directory

* f518175 Merge pull request #30 from bilrost/feat/svn-url
This is just adding a "url" field referring to the svn url of the project.

* cc0e3bf Merge pull request #35 from bilrost/feat/workspace_modules

* 89f25f4 Merge pull request #34 from bilrost/feat/vcs-valid
  This adds validation to Repo_manager to check if the workspace is in a working environment.

* cdb6397 Merge pull request #27 from bilrost/feat/assembly
    Use Conduit RPC for listing dependencies. Supported files are for now:
    - application/vnd.valhalla.assembly+json
    - model/vnd.collada+xml
    - application/javascript
    - audio/x-wav

    To do:
    - list collada dependencies (broken)
    - support more resources

* 304dbc6 Merge pull request #26 from bilrost/feat/clarify_how_jenkins_runs_tests_with_docker
  Adds a new script (used by jenkins https://jk1-dev1.starbreeze.com:46721/job/bilrost/) that explains how to run tests with docker and linux.

* d63b236 Merge pull request #21 from bilrost/feat/wseventbus_tests
    This PR allows the server to call remotely engine procedures. The API will be used for manipulating assemblies and therefore managing this kind of resource internally in our asset management:
    * Rename
    * Validate
    * List dependencies
    
    This comes with a test that mocks engine instance.


## Refactors
* 1d0cc69 Merge pull request #43 from bilrost/misc/update-particle-links
  Related to this PR fl4re/fl4re-engine#2442

* 2955831 Merge pull request #33 from bilrost/misc/reorganize_directories
  Moves all files from src/server folder to root. Including package.json.

* 218004f Merge pull request #36 from bilrost/misc/dont-stringify-msg
  Make conduit process slightly faster. We already have stringified message that we can use

* 49b0467 Merge pull request #32 from bilrost/misc/move_release_notes_from_wiki_to_docs
  Moves the Release_Notes document from the wiki to the docs folder.

* 939db67 Merge pull request #37 from bilrost/fix/not-found-err
  Unifies the CONTENTNOTFOUND and NOTFOUND errors.

* 2170c63 Merge pull request #28 from bilrost/misc/refactor_move_asset_manager_to_workspace
  This is a set of refactors to move business logic from the controller to the domain entities.
  In particular, it makes assetmanager ignorant of any status_manager object. And Workspace is the only responsible of the status_manager creation and delegation.

## Fixes
* c3286cb Merge pull request #47 from bilrost/fix/collada_dependencies
  Dependencies retrieved by the engine were erasing the ones specified by the user.

* 7c699ad Merge pull request #46 from bilrost/fix/cb_regexp
  Fix for resources url regex that contains the work 'assets'. https://monosnap.com/file/qA3oRit1tgI12eFSMTXHYr30rg4vJL

* a02c918 Merge pull request #31 from bilrost/fix/module_manager
  This api allows users to ask to node for loading scripts (plugins). Implementation moved from proxy.js to a plugin file, fixed bugs and wrote tests.

* 2f69186 Merge pull request #44 from bilrost/fix/close_db
  Closes search index instance to get rid of windows file lockdown

* 047298d Merge pull request #40 from bilrost/fix/handler_sendHTML_correct_header
  Fixes handler Content-Type header for sendHTML method.

* fcb1e31 Merge pull request #23 from bilrost/fix/add_jshint_to_dev_dependencies

* c730e74 Merge pull request #24 from bilrost/fix/add_workspace
  This crash was happening when a workspace with an initialized database is added and asset operations are queried.
  The cause was the version id not cached after the workspace gets added to the favorite list.


# Bilrost v1.0.0
Bilrost is an HTTP and WS server to remote control the Valhalla Engine. It is mainly used by UI Tools.

This version is the first published as an independent npm module. Before this version Bilrost was part of fl4re-ui and there was no explicit versioning for the server.
Even this are the first ever published release notes, they only contain the latest changes.

Breaking changes:
* changed API call to create workspaces. Before version 1.0.0, `PUT /assetmanager/workspaces` was used to enable an existing workspace to be managed by Asset Manager. This has been changed to `POST /assetmanager/workspaces`.

Features:
* search API for assets and resources
* use of leveldb (levelup) db to store search index information
* define workspace status and its caching mechanism
* UI to show how the API works
* asset validation


