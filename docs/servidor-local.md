# Cómo correr Maximus Gym como servidor local (solo visible en el WiFi del gym)

Esta guía sirve para que la página **no esté en internet** — solo se pueda
ver desde celulares/computadoras conectados al WiFi del gimnasio. Se usa
la misma PC de administración (Windows) como servidor.

## 1. Instalar Python (si no lo tienes)

1. Abre el menú Inicio, escribe `cmd` y abre la "Símbolo del sistema".
2. Escribe `python --version` y presiona Enter.
   - Si te muestra un número de versión (ej. `Python 3.12.1`), ya lo tienes. Salta al paso 2.
   - Si dice que no reconoce el comando, ve a **python.org/downloads** (la página oficial),
     descarga el instalador de Windows y ejecútalo. **Importante:** en la primera pantalla del
     instalador, marca la casilla **"Add python.exe to PATH"** antes de darle a Instalar.
3. Cierra y vuelve a abrir la Símbolo del sistema, y repite `python --version` para confirmar.

## 2. Copiar los archivos de la página a la PC

Copia toda la carpeta del proyecto (la que tiene `index.html`, `css/`, `js/`, `assets/`)
a un lugar fijo en esa PC, por ejemplo:

```
C:\MaximusGym\
```

## 3. Iniciar el servidor

1. Abre la Símbolo del sistema.
2. Escribe (ajusta la ruta si copiaste la carpeta en otro lugar):
   ```
   cd C:\MaximusGym
   python -m http.server 8080
   ```
3. Deja esa ventana abierta — mientras esté abierta, el sitio está disponible.
   Para apagarlo, cierra la ventana o presiona `Ctrl + C`.

## 4. Encontrar la IP local de la PC

1. Abre otra Símbolo del sistema y escribe:
   ```
   ipconfig
   ```
2. Busca la línea **"Dirección IPv4"** (algo como `192.168.1.50`). Ese número es
   la dirección que usarán los celulares/computadoras conectados al mismo WiFi.

## 5. Abrir el puerto en el Firewall de Windows

1. Busca en el menú Inicio "Firewall de Windows Defender" → "Configuración avanzada".
2. Click derecho en "Reglas de entrada" → "Nueva regla".
3. Tipo: **Puerto** → Siguiente.
4. **TCP**, puerto específico: `8080` → Siguiente.
5. "Permitir la conexión" → Siguiente → deja marcadas las tres casillas → Siguiente.
6. Ponle un nombre (ej. "Maximus Gym servidor") → Finalizar.

## 6. Probar desde un celular

1. Conecta tu celular al WiFi del gym.
2. Abre el navegador y entra a (usa la IP que viste en el paso 4):
   ```
   http://192.168.1.50:8080
   ```
3. Debería cargar la página de Maximus Gym.

## 7. (Opcional) Que la IP de la PC no cambie nunca

Los routers normalmente reasignan direcciones IP con el tiempo, lo que haría
que el número del paso 4 cambie algún día. Para evitarlo:

1. Entra a la configuración del router (usualmente `192.168.1.1` o `192.168.0.1`
   en el navegador — la clave suele estar en una etiqueta del router).
2. Busca una sección llamada **"DHCP Reservation"**, **"Reserva de IP"** o
   **"Static Lease"** (el nombre exacto varía según la marca del router).
3. Reserva la IP actual de la PC de administración a su dirección MAC (también
   visible con `ipconfig /all`, campo "Dirección física").

Si no encuentras esta opción, no es indispensable — solo tendrías que revisar
la IP con `ipconfig` de vez en cuando si notas que dejó de funcionar.

## 8. (Opcional) Código QR para que los clientes no tengan que escribir la URL

Una vez que tengas la URL final (ej. `http://192.168.1.50:8080`), puedes generar
un código QR gratis en un sitio como qr-code-generator.com, imprimirlo y pegarlo
en el gym junto con el WiFi. Los clientes solo escanean, conectados al WiFi, y
se abre la página directamente.

## 9. (Opcional) Que el servidor arranque solo al prender la PC

Para no tener que abrir la Símbolo del sistema manualmente cada día:

1. Crea un archivo de texto llamado `iniciar-maximus.bat` dentro de `C:\MaximusGym\`
   con este contenido:
   ```
   cd /d C:\MaximusGym
   python -m http.server 8080
   ```
2. Abre el "Programador de tareas" de Windows → "Crear tarea básica".
3. Desencadenador: "Al iniciar sesión".
4. Acción: "Iniciar un programa" → selecciona el archivo `iniciar-maximus.bat`.
5. Guarda. Desde ahora, cada vez que se inicie sesión en Windows, el servidor
   arrancará solo.

---

**Nota:** mientras esa PC esté apagada, la página no estará disponible para
nadie — ni siquiera para los clientes del gym. Como el gym tampoco abre de
noche, esto normalmente no debería ser un problema.
