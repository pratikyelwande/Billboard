@echo off
setlocal enabledelayedexpansion

:: Retrieve PostgreSQL installation path from the registry
for /f "tokens=2*" %%A in ('reg query "HKLM\SOFTWARE\PostgreSQL\Installations" /s ^| findstr /i "Base Directory"') do (
    set PG_PATH=%%B
)

:: Append the bin directory
set PG_PATH=!PG_PATH!\bin

:: Define database connection details
set DB_NAME="billboard"
set USERNAME="postgres"
set PASSWORD="root"
set SQL_FILE="C:\path\to\billboard.sql"

echo PostgreSQL binary path detected: !PG_PATH!
echo Importing billboard.sql into %DB_NAME%...

:: Set the password environment variable (optional for security)
set PGPASSWORD=%PASSWORD%

:: Execute SQL file
"!PG_PATH!\psql.exe" -U %USERNAME% -d %DB_NAME% -f %SQL_FILE%

:: Cleanup environment variable
set PGPASSWORD=

echo Import completed!
pause
