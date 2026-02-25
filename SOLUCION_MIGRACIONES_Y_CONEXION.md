# 🔧 Solución: Errores de Conexión y Migraciones

## 🐛 Problemas Identificados

### Problema 1: Error de Conexión
```
TypeError: Invalid URL
input: 'postgres://postgres:postgres@:/default'
```
**Causa**: Algún servicio todavía no tiene `PG_DATABASE_URL` configurada correctamente.

### Problema 2: Error de Migraciones
```
error: relation "core.keyValuePair" does not exist
```
**Causa**: Las migraciones de la base de datos no se han ejecutado. La base de datos está vacía.

---

## ✅ SOLUCIÓN COMPLETA

### Paso 1: Verificar Variables del SERVER

Ve a **Server** → **Variables** y asegúrate de tener:

#### ✅ Variables OBLIGATORIAS:

```bash
PG_DATABASE_URL=postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
SERVER_URL=https://server-production-fdc1.up.railway.app
REDIS_URL=redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597
APP_SECRET=ksjf9823HJS98hd98HADH989dsadJASD
NODE_ENV=production
NODE_PORT=3000
```

#### ⚠️ IMPORTANTE: DISABLE_DB_MIGRATIONS en SERVER

**El Server NO debe tener `DISABLE_DB_MIGRATIONS=true`** porque necesita ejecutar las migraciones.

- ✅ **NO agregues** `DISABLE_DB_MIGRATIONS` al Server
- ✅ O si existe, **elimínala** o configúrala como `false`
- ✅ El Server DEBE ejecutar las migraciones automáticamente al iniciar

#### ❌ Variables que NO debe tener:

- `PG_DATABASE_HOST` - Eliminar si existe
- `PG_DATABASE_PORT` - Eliminar si existe
- `DISABLE_DB_MIGRATIONS=true` - NO debe tener esto

### Paso 2: Verificar Variables del WORKER

Ve a **Worker** → **Variables** y asegúrate de tener:

#### ✅ Variables OBLIGATORIAS:

```bash
PG_DATABASE_URL=postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
SERVER_URL=https://server-production-fdc1.up.railway.app
REDIS_URL=redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597
APP_SECRET=ksjf9823HJS98hd98HADH989dsadJASD
DISABLE_DB_MIGRATIONS=true
NODE_ENV=production
```

#### ⚠️ IMPORTANTE: DISABLE_DB_MIGRATIONS en WORKER

**El Worker SÍ debe tener `DISABLE_DB_MIGRATIONS=true`** porque NO debe ejecutar migraciones.

- ✅ **DEBE tener** `DISABLE_DB_MIGRATIONS=true`
- ✅ Solo el Server ejecuta migraciones

---

## 📋 Resumen de Configuración Correcta

### SERVER:

| Variable | Valor | Notas |
|----------|-------|-------|
| `PG_DATABASE_URL` | `postgresql://postgres:...@postgres.railway.internal:5432/railway` | ✅ URL completa |
| `SERVER_URL` | `https://server-production-fdc1.up.railway.app` | ✅ Con https:// |
| `REDIS_URL` | `redis://default:...@shinkansen.proxy.rlwy.net:26597` | ✅ URL completa |
| `APP_SECRET` | `ksjf9823HJS98hd98HADH989dsadJASD` | ✅ Clave secreta |
| `NODE_ENV` | `production` | ✅ |
| `NODE_PORT` | `3000` | ✅ |
| `DISABLE_DB_MIGRATIONS` | **NO debe existir** o `false` | ⚠️ **CRÍTICO** |

### WORKER:

| Variable | Valor | Notas |
|----------|-------|-------|
| `PG_DATABASE_URL` | `postgresql://postgres:...@postgres.railway.internal:5432/railway` | ✅ Misma que Server |
| `SERVER_URL` | `https://server-production-fdc1.up.railway.app` | ✅ Misma que Server |
| `REDIS_URL` | `redis://default:...@shinkansen.proxy.rlwy.net:26597` | ✅ Misma que Server |
| `APP_SECRET` | `ksjf9823HJS98hd98HADH989dsadJASD` | ✅ Misma que Server |
| `DISABLE_DB_MIGRATIONS` | `true` | ⚠️ **CRÍTICO** |
| `NODE_ENV` | `production` | ✅ |

---

## 🔄 Pasos para Corregir

### 1. Corregir SERVER

1. Ve a **Server** → **Variables**
2. Verifica que `PG_DATABASE_URL` tenga la URL completa correcta
3. **ELIMINA** `DISABLE_DB_MIGRATIONS` si existe o configúrala como `false`
4. **ELIMINA** `PG_DATABASE_HOST` y `PG_DATABASE_PORT` si existen
5. **Guarda** los cambios

### 2. Corregir WORKER

1. Ve a **Worker** → **Variables**
2. Verifica que `PG_DATABASE_URL` tenga la URL completa correcta
3. **AGREGA** o **VERIFICA** que `DISABLE_DB_MIGRATIONS=true` esté configurada
4. **ELIMINA** `PG_DATABASE_HOST` y `PG_DATABASE_PORT` si existen
5. **Guarda** los cambios

### 3. Verificar Comando del Worker

1. Ve a **Worker** → **Settings**
2. Verifica que el comando sea: `yarn worker:prod`
3. **Guarda** los cambios

### 4. Esperar y Verificar

1. Railway redesplegará automáticamente
2. Espera 5-10 minutos (las migraciones pueden tardar)
3. Revisa los logs del **Server** primero
4. Busca mensajes como:
   - ✅ `Running database setup and migrations...`
   - ✅ `Successfully migrated DB!`
   - ✅ `[TypeOrmModule] Connection established successfully`
   - ✅ `[NestApplication] Nest application successfully started`

---

## ⚠️ Notas Importantes

### Sobre las Migraciones:

1. **Solo el Server ejecuta migraciones** - El Worker tiene `DISABLE_DB_MIGRATIONS=true`
2. **Las migraciones se ejecutan automáticamente** cuando el Server inicia (si `DISABLE_DB_MIGRATIONS` no está configurada o es `false`)
3. **Las migraciones pueden tardar varios minutos** en la primera ejecución
4. **No inicies el Worker hasta que el Server haya completado las migraciones**

### Sobre la Conexión:

1. **Ambos servicios** (Server y Worker) necesitan `PG_DATABASE_URL` con la URL completa
2. **NO uses** `PG_DATABASE_HOST` y `PG_DATABASE_PORT` por separado
3. **El host debe ser** `postgres.railway.internal` (dominio interno de Railway)

---

## ✅ Checklist Final

### Server:
- [ ] `PG_DATABASE_URL` configurada con URL completa
- [ ] `SERVER_URL` configurada
- [ ] `REDIS_URL` configurada
- [ ] `APP_SECRET` configurada
- [ ] `NODE_ENV=production`
- [ ] `NODE_PORT=3000`
- [ ] `DISABLE_DB_MIGRATIONS` NO existe o es `false`
- [ ] `PG_DATABASE_HOST` eliminada
- [ ] `PG_DATABASE_PORT` eliminada

### Worker:
- [ ] `PG_DATABASE_URL` configurada (misma que Server)
- [ ] `SERVER_URL` configurada (misma que Server)
- [ ] `REDIS_URL` configurada (misma que Server)
- [ ] `APP_SECRET` configurada (misma que Server)
- [ ] `DISABLE_DB_MIGRATIONS=true` ✅ **CRÍTICO**
- [ ] `NODE_ENV=production`
- [ ] Comando: `yarn worker:prod`
- [ ] `PG_DATABASE_HOST` eliminada
- [ ] `PG_DATABASE_PORT` eliminada

---

## 🐛 Si los Errores Persisten

### Error de Conexión:
1. Verifica que `PG_DATABASE_URL` no tenga espacios al inicio/final
2. Verifica que el host sea `postgres.railway.internal` (no solo "postgresql")
3. Verifica que el servicio PostgreSQL esté corriendo en Railway

### Error de Migraciones:
1. Verifica que el Server NO tenga `DISABLE_DB_MIGRATIONS=true`
2. Espera más tiempo (las migraciones pueden tardar 5-10 minutos)
3. Revisa los logs del Server para ver el progreso de las migraciones
4. Si las migraciones fallan, puede ser un problema de permisos en la base de datos

---

## 📝 Orden de Ejecución Recomendado

1. **Primero**: Configura y despliega el **Server**
2. **Espera**: A que el Server complete las migraciones (5-10 minutos)
3. **Verifica**: Que los logs del Server muestren "Successfully migrated DB!"
4. **Después**: Configura y despliega el **Worker**
5. **Verifica**: Que ambos servicios estén corriendo sin errores







