# 🔄 Guía: Sincronizar Metadata en Railway

## 📋 Resumen

Para sincronizar la metadata en Railway, necesitas ejecutar el comando:
```bash
npx nx run twenty-server:command workspace:sync-metadata
```

Railway **NO tiene terminal web integrada**, así que tienes estas opciones:

---

## ⚡ Autodeploy en Railway - Preguntas Frecuentes

### ¿Se reinician automáticamente los servicios cuando hago push?

**✅ SÍ**, si tienes Railway conectado a tu repositorio de GitHub:

1. **Railway detecta automáticamente** los cambios cuando haces `git push`
2. **Railway redesplegará automáticamente** tus servicios (Server y Worker)
3. **NO necesitas hacer nada manualmente** - Railway lo hace todo

### ¿Cuándo necesito sincronizar metadata?

**NO necesitas sincronizar en cada push.** Solo necesitas sincronizar cuando:

✅ **SÍ necesitas sincronizar:**
- Cuando creas/modificas **objetos personalizados** desde la UI de Twenty
- Cuando agregas **campos personalizados** a objetos (estándar o personalizados)
- Cuando creas **relaciones** entre objetos personalizados
- Cuando ves errores como: `encountered unknown fields imssServicioId in objectMetadataItem attachment`
- Después de **actualizar la versión de Twenty** a una nueva release

❌ **NO necesitas sincronizar:**
- Cuando haces cambios normales al código (frontend, backend, estilos, etc.)
- Cuando haces push de código que no afecta la estructura de datos
- Cuando solo modificas lógica de negocio o UI

### ¿Puedo sincronizar después de hacer push?

**Sí, pero no es necesario en cada push.** La sincronización es independiente del código:

- **Los cambios de código** → Railway los despliega automáticamente
- **La sincronización de metadata** → Solo necesaria cuando cambias la estructura de datos

**Flujo recomendado:**
1. Haz tus cambios de código → `git push` → Railway despliega automáticamente ✅
2. Si creaste/modificaste objetos personalizados → Ejecuta sincronización de metadata ✅
3. Si solo cambiaste código → **NO necesitas sincronizar** ✅

---

---

## ✅ OPCIÓN 1: Railway CLI (Recomendada)

### Paso 1: Instalar Railway CLI

**En Windows (PowerShell):**
```powershell
# Opción A: Usando winget
winget install --id Railway.Railway

# Opción B: Usando npm (si tienes Node.js)
npm install -g @railway/cli

# Opción C: Usando scoop
scoop install railway
```

**En Mac/Linux:**
```bash
curl -fsSL https://railway.app/install.sh | sh
```

### Paso 2: Iniciar sesión en Railway CLI

```bash
railway login
```

Esto abrirá tu navegador para autenticarte.

### Paso 3: Conectarte a tu proyecto

```bash
# Listar tus proyectos
railway projects

# Conectarte a tu proyecto específico
railway link
```

Si tienes varios proyectos, selecciona el correcto cuando te lo pida.

### Paso 4: Conectarte al servicio Server

```bash
# Ver tus servicios
railway service

# Conectarte al servicio "server"
railway service server
```

### Paso 5: Ejecutar el comando de sincronización

```bash
railway run npx nx run twenty-server:command workspace:sync-metadata
```

O si estás dentro del contenedor:

```bash
railway run bash -c "cd /app && npx nx run twenty-server:command workspace:sync-metadata"
```

---

## ✅ OPCIÓN 2: One-off Deployment (Sin CLI)

### Paso 1: Crear un nuevo servicio temporal

1. En Railway, haz clic en **"+ New"** → **"Empty Service"**
2. Nómbralo: `sync-metadata-temp` (o cualquier nombre)
3. Selecciona la **misma imagen** que tu servicio Server: `twentycrm/twenty:latest`

### Paso 2: Configurar Variables de Entorno

1. Ve a **Variables** del nuevo servicio
2. **Copia TODAS las variables** del servicio Server:
   - `SERVER_URL`
   - `PG_DATABASE_URL`
   - `REDIS_URL`
   - `APP_SECRET`
   - `NODE_ENV=production`
   - (Todas las demás que tenga el Server)

### Paso 3: Configurar el Comando de Inicio

1. Ve a **Settings** → **Deploy**
2. Busca **"Start Command"** o **"Command"**
3. Configura:
```bash
npx nx run twenty-server:command workspace:sync-metadata
```

### Paso 4: Desplegar y Esperar

1. Railway desplegará automáticamente
2. Ve a **Deployments** para ver el progreso
3. Ve a **Logs** para ver la salida del comando
4. Espera a que termine (puede tomar 1-3 minutos)

### Paso 5: Verificar y Eliminar

1. Revisa los logs para confirmar que la sincronización fue exitosa
2. Busca mensajes como: `Finished synchronizing workspace`
3. Una vez confirmado, **elimina el servicio temporal**:
   - Haz clic derecho en el servicio → **Delete Service**

---

## ✅ OPCIÓN 3: Modificar Start Command Temporalmente

⚠️ **ADVERTENCIA**: Esta opción puede interrumpir tu servicio si no lo haces correctamente.

### Paso 1: Anotar el comando actual

1. Ve a tu servicio **Server** → **Settings** → **Deploy**
2. Anota el **Start Command** actual (probablemente esté vacío o sea `yarn start`)

### Paso 2: Cambiar temporalmente el comando

1. En **Start Command**, configura:
```bash
npx nx run twenty-server:command workspace:sync-metadata && yarn start
```

O si quieres que se ejecute solo una vez y luego se detenga:

```bash
npx nx run twenty-server:command workspace:sync-metadata
```

### Paso 3: Desplegar

1. Railway redesplegará automáticamente
2. Ve a **Logs** para ver la ejecución
3. Espera a que termine

### Paso 4: Restaurar el comando original

1. Una vez que veas `Finished synchronizing workspace` en los logs
2. Restaura el **Start Command** original (vacío o `yarn start`)
3. Railway redesplegará con el comando normal

---

## 🔍 Verificar que funcionó

Después de ejecutar cualquiera de las opciones, verifica en los logs:

### ✅ Logs exitosos deberían mostrar:
```
[Nest] LOG Running workspace sync for workspace: [workspace-id] (1 out of 1)
[Nest] LOG Finished synchronizing workspace.
```

### ❌ Si hay errores, verás:
```
Error: ...
```

---

## 🐛 Solución de Problemas

### Error: "Command not found: nx"
- ✅ Asegúrate de estar usando la imagen correcta: `twentycrm/twenty:latest`
- ✅ El comando debe ejecutarse desde `/app` dentro del contenedor

### Error: "Cannot connect to database"
- ✅ Verifica que `PG_DATABASE_URL` esté configurada correctamente
- ✅ Verifica que el servicio PostgreSQL esté activo

### Error: "Workspace not found"
- ✅ El comando sincroniza todos los workspaces activos automáticamente
- ✅ Si tienes múltiples workspaces, todos se sincronizarán

### El comando se ejecuta pero no veo cambios
- ✅ Limpia la caché del navegador
- ✅ Recarga la aplicación (Ctrl+F5 o Cmd+Shift+R)
- ✅ Los cambios pueden tardar unos segundos en reflejarse

---

## 📝 Comando Completo de Referencia

```bash
# Forma completa del comando
npx nx run twenty-server:command workspace:sync-metadata

# Con opciones adicionales (dry-run para probar sin aplicar cambios)
npx nx run twenty-server:command workspace:sync-metadata --dry-run

# Para un workspace específico (si el comando lo soporta)
npx nx run twenty-server:command workspace:sync-metadata --workspace-id=<id>
```

---

## 💡 Recomendación

**Usa la OPCIÓN 1 (Railway CLI)** porque:
- ✅ Es la forma más limpia y profesional
- ✅ No interrumpe tu servicio
- ✅ Puedes ejecutar comandos cuando quieras
- ✅ Es la forma oficial recomendada por Railway

**Usa la OPCIÓN 2 (One-off Deployment)** si:
- ✅ No puedes instalar Railway CLI
- ✅ Prefieres hacerlo desde la interfaz web
- ✅ Quieres ver los logs directamente en Railway

**Evita la OPCIÓN 3** a menos que:
- ⚠️ No tengas otra alternativa
- ⚠️ Estés dispuesto a tener downtime temporal

---

## 📚 Referencias

- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [Railway One-off Deployments](https://docs.railway.app/develop/cli#one-off-deployments)
- [Twenty Metadata Sync Command](../packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/commands/sync-workspace-metadata.command.ts)

