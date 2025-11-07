import os

# Dimension de la pantalla , el alto y el  ancho de la panatalla
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

#eSPECIFICAMOS LOS COLORES DE LA PANTALLA
COLOR_LASER = (0, 0, 255)#AZUL


# RUTA A LA CARPETA ASSETS

ASSETS_PATH = os.path.join(os.path.dirname(__file__), 'assets_1')

IMPERIAl_MARCH_PATH = f'{ASSETS_PATH}/sounds/ Imperial March - kenobi.mp3'
START_IMAGE_PATH = f'{ASSETS_PATH}/image/inicio/start.png'
ESTRELLA_PATH = f'{ASSETS_PATH}/image/inicio/Estrella.png'
FONDO1_PATH = f'{ASSETS_PATH}/image/fondo1.jpg'