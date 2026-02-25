# 🔧 Solución: Error de Módulo y Migraciones

## 🐛 Problemas Identificados

### Problema 1: Error de Módulo
```
Error: Cannot find module '/app/packages/twenty-server/dist/src/main'
```
**Causa**: El comando de inicio está usando un path absoluto incorrecto o está sobrescribiendo el entrypoint del Dockerfile.

### Problema 2: Migraciones No Ejecutadas
```
relation "core.keyValuePair" does not exist
```
**Causa**: Las migraciones no se están ejecutando porque el entrypoint no se está ejecutando correctamente.

---

## ✅ SOLUCIÓN: Configurar Comando Correcto

### Paso 1: Verificar/Corregir Comando del Server

1. Ve a **Server** → **Settings**
2. Busca **"Start Command"** o **"Command"**
3. **DEBE estar completamente VACÍO** o eliminado

**¿Por qué?** El Dockerfile ya tiene configurado:
- `WORKDIR /app/packages/twenty-server`
- `CMD ["node", "dist/src/main"]`
- `ENTRYPOINT ["/app/entrypoint.sh"]`

Si configuras un comando en Railway, puedes estar sobrescribiendo el entrypoint que ejecuta las migraciones.

### Paso 2: Si Railway Requiere un Comando

Si Railway **requiere** que configures un comando (no te deja dejarlo vacío), usa:

```
node dist/src/main
```

**NO uses:**
- ❌ `/app/packages/twenty-server/dist/src/main` (path absoluto)
- ❌ `node /app/packages/twenty-server/dist/src/main` (path absoluto)
- ❌ `yarn start` o `npm start`

**Usa:**
- ✅ `node dist/src/main` (path relativo al WORKDIR)

### Paso 3: Verificar Variables del Server

Asegúrate de que el Server tenga estas variables:

```bash
PG_DATABASE_URL=postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
SERVER_URL=https://server-production-fdc1.up.railway.app
REDIS_URL=redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597
APP_SECRET=ksjf9823HJS98hd98HADH989dsadJASD
NODE_ENV=production
NODE_PORT=3000
# NO debe tener DISABLE_DB_MIGRATIONS
```

---

## 🔍 Cómo Verificar que Funcione

Después de corregir el comando:

1. **Guarda** los cambios
2. Railway redesplegará automáticamente
3. **Espera 5-10 minutos**
4. Ve a **Server** → **Deployments** → **Logs**
5. Busca estos mensajes en orden:

### ✅ Mensajes Esperados (deben aparecer):

```
=== Environment Variables ===
=== File Check ===
=== Starting Application ===
Running database setup and migrations...
Database appears to be empty, running migrations.
Successfully migrated DB!
[TypeOrmModule] Connection established successfully
[NestApplication] Nest application successfully started
```

### ❌ Mensajes de Error (NO deben aparecer):

```
Error: Cannot find module '/app/packages/twenty-server/dist/src/main'
relation "core.keyValuePair" does not exist
Database setup and migrations are disabled, skipping...
```

---

## 📋 Resumen de Configuración Correcta

### SERVER:

| Configuración | Valor | Notas |
|---------------|-------|-------|
| **Start Command** | **VACÍO** (preferido) o `node dist/src/main` | ⚠️ **CRÍTICO** |
| `PG_DATABASE_URL` | URL completa | ✅ |
| `SERVER_URL` | URL pública | ✅ |
| `REDIS_URL` | URL completa | ✅ |
| `APP_SECRET` | Clave secreta | ✅ |
| `NODE_ENV` | `production` | ✅ |
| `NODE_PORT` | `3000` | ✅ |
| `DISABLE_DB_MIGRATIONS` | **NO debe existir** | ⚠️ **CRÍTICO** |

### WORKER:

| Configuración | Valor | Notas |
|---------------|-------|-------|
| **Start Command** | `yarn worker:prod` | ✅ |
| `PG_DATABASE_URL` | URL completa (misma que Server) | ✅ |
| `SERVER_URL` | URL pública (misma que Server) | ✅ |
| `REDIS_URL` | URL completa (misma que Server) | ✅ |
| `APP_SECRET` | Clave secreta (misma que Server) | ✅ |
| `DISABLE_DB_MIGRATIONS` | `true` | ⚠️ **CRÍTICO** |
| `NODE_ENV` | `production` | ✅ |

---

## 🔄 Pasos Exactos para Corregir

### 1. Corregir Comando del Server

1. Ve a **Server** → **Settings**
2. Busca **"Start Command"** o **"Command"**
3. **ELIMINA** cualquier valor que tenga
4. Si Railway no te deja dejarlo vacío, configura: `node dist/src/main`
5. **Guarda** los cambios

### 2. Verificar Variables del Server

1. Ve a **Server** → **Variables**
2. Verifica que `PG_DATABASE_URL` tenga la URL completa correcta
3. **ELIMINA** `DISABLE_DB_MIGRATIONS` si existe
4. **Guarda** los cambios

### 3. Esperar y Verificar

1. Railway redesplegará automáticamente
2. **Espera 5-10 minutos** (las migraciones pueden tardar)
3. Revisa los logs del Server desde el inicio
4. Busca los mensajes de éxito mencionados arriba

---

## ⚠️ Notas Importantes

1. **El entrypoint del Dockerfile** (`/app/entrypoint.sh`) ejecuta automáticamente las migraciones antes de iniciar el servidor
2. **NO sobrescribas el comando** a menos que sea absolutamente necesario
3. **Si debes configurar un comando**, usa `node dist/src/main` (path relativo)
4. **El WORKDIR** en el Dockerfile es `/app/packages/twenty-server`, por eso el comando debe ser relativo
5. **Las migraciones solo se ejecutan** si el entrypoint se ejecuta correctamente

---

## 🐛 Si el Error Persiste

Si después de corregir el comando el error persiste:

1. **Verifica** que el comando sea exactamente `node dist/src/main` (sin paths absolutos)
2. **Revisa** los logs completos del Server desde el inicio del deploy
3. **Busca** mensajes del entrypoint como "=== Environment Variables ==="
4. **Verifica** que el servicio esté usando la imagen correcta de Docker (`twentycrm/twenty:latest`)
5. **Considera** verificar que Railway esté usando el Dockerfile correcto

---

## ✅ Checklist Final

### Configuración del Server:
- [ ] Comando de inicio: **VACÍO** o `node dist/src/main`
- [ ] `PG_DATABASE_URL` configurada correctamente
- [ ] `DISABLE_DB_MIGRATIONS` NO existe
- [ ] Todas las variables obligatorias configuradas

### Verificación:
- [ ] Server redesplegado
- [ ] Logs muestran "=== Environment Variables ==="
- [ ] Logs muestran "Running database setup and migrations..."
- [ ] Logs muestran "Successfully migrated DB!"
- [ ] Logs muestran "[NestApplication] Nest application successfully started"
- [ ] NO aparecen errores de "Cannot find module"
- [ ] NO aparecen errores de "relation does not exist"







