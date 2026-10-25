@echo off
rem Recolecta CNT y publica los cambios, sin Claude (no gasta tokens). Lo corre el Programador de tareas de Windows.
rem CNT Empleo solo acepta conexiones desde Ecuador, por eso no esta en GitHub Actions.
rem
rem Registrar la tarea (una vez; corre cada dia a las 21:00 si el equipo esta encendido):
rem   schtasks /Create /SC DAILY /ST 21:00 /TN "UPEC - Recolectar CNT" /TR "C:\Users\Geovanny\Documents\student\scripts\cnt\tarea-windows.cmd" /F
rem Quitarla:
rem   schtasks /Delete /TN "UPEC - Recolectar CNT" /F
rem Registro de cada corrida: scripts\cnt\tarea-windows.log (no se sube al repositorio)

set "BASH=%ProgramFiles%\Git\bin\bash.exe"
set "LOG=%~dp0tarea-windows.log"
if not exist "%BASH%" (
  echo %date% %time% No se encontro Git Bash en "%BASH%".>> "%LOG%"
  exit /b 1
)
echo ===== %date% %time% =====>> "%LOG%"
"%BASH%" "%~dp0publicar.sh" >> "%LOG%" 2>&1
echo Salida: %errorlevel% >> "%LOG%"
