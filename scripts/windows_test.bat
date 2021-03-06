@ECHO OFF
REM # This script is intended to be run by Jenkins,
REM # it must be run setting the following Env Variables:
REM #   AWS_S3_CREDENTIALS, is the file that contains the S3 credentials

echo "setting S3 config file"
if not exist "config" mkdir config
copy /Y %AWS_S3_CREDENTIALS% config\

call yarn install
if %errorlevel% neq 0 exit /b %errorlevel%

call jshint . --exclude ./node_modules
if %errorlevel% neq 0 exit /b %errorlevel%

call yarn jenkins
if %errorlevel% neq 0 exit /b %errorlevel%
