# Proyecto Python -- Instrucciones de Ejecución

Este proyecto utiliza Python y requiere un entorno virtual para aislar
las dependencias.\
A continuación se detalla el procedimiento recomendado para poner el
programa en marcha.

------------------------------------------------------------------------

## 1. Crear entorno virtual

En la raíz del proyecto ejecutar:

``` bash
python -m venv venv
```

Esto generará una carpeta llamada `venv` con el entorno virtual.

------------------------------------------------------------------------

## 2. Activar el entorno virtual

### ✔ Windows

``` bash
venv\Scripts\activate
```

### ✔ macOS / Linux

``` bash
source venv/bin/activate
```

Una vez activado, deberías ver el prefijo `(venv)` en la consola.

------------------------------------------------------------------------

## 3. Instalar dependencias

Asegurate de tener el archivo `requirements.txt` en el proyecto.

``` bash
pip install -r requirements.txt
```

------------------------------------------------------------------------

## 4. Ejecutar el programa

El archivo principal del proyecto es `main.py`.

``` bash
python main.py
```

------------------------------------------------------------------------

## 5. Desactivar el entorno virtual (opcional)

Cuando termines de trabajar:

``` bash
deactivate
```

------------------------------------------------------------------------

## ✅ Listo

Con estos pasos ya podes jugar!
