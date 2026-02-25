# 🔧 Solución: Worker Crasheado - Error "Invalid URL"

## 🐛 Problema Identificado

El Worker está crasheando con el error:
```
TypeError: Invalid URL
input: 'postgres://postgres:postgres@:/default'
```

**Causa**: El script `render-worker.sh` está intentando construir `PG_DATABASE_URL` desde `PG_DATABASE_HOST` y `PG_DATABASE_PORT` que están vacías.

---

## ✅ SOLUCIÓN: Configurar Worker Correctamente

### Paso 1: Verificar Variables del Worker

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

#### ❌ Variables que NO debes tener:

- `PG_DATABASE_HOST` - NO debe existir
- `PG_DATABASE_PORT` - NO debe existir

### Paso 2: Verificar el Comando del Worker

1. Ve a **Worker** → **Settings**
2. Busca **"Start Command"** o **"Command"**
3. **DEBE ser exactamente**:

```
yarn worker:prod
```

**NO debe ser:**
- ❌ `sh -c ./scripts/render-worker.sh`
- ❌ `./scripts/render-worker.sh`
- ❌ Cualquier otro comando

### Paso 3: Verificar que PG_DATABASE_URL esté Configurada

1. Ve a **Worker** → **Variables**
2. Busca `PG_DATABASE_URL`
3. Haz clic para ver/editar
4. **DEBE tener este valor EXACTO**:

```
postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
```

5. Si no tiene ese valor, edítalo y guárdalo

---

## 🔍 Verificación Completa del Worker

### Variables que DEBE tener:

| Variable | Valor | Estado |
|----------|-------|--------|
| `PG_DATABASE_URL` | `postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway` | ✅ **VERIFICAR** |
| `SERVER_URL` | `https://server-production-fdc1.up.railway.app` | ✅ Verificar |
| `REDIS_URL` | `redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597` | ✅ Verificar |
| `APP_SECRET` | `ksjf9823HJS98hd98HADH989dsadJASD` | ✅ Verificar |
| `DISABLE_DB_MIGRATIONS` | `true` | ✅ Verificar |
| `NODE_ENV` | `production` | ✅ Verificar |

### Variables que NO debe tener:

| Variable | Acción |
|----------|--------|
| `PG_DATABASE_HOST` | ❌ **ELIMINAR** si existe |
| `PG_DATABASE_PORT` | ❌ **ELIMINAR** si existe |

### Comando de Inicio:

| Configuración | Valor Correcto |
|---------------|----------------|
| **Start Command** | `yarn worker:prod` |

---

## 📝 Pasos Exactos para Corregir

### 1. Verificar Variables del Worker

1. Ve a **Worker** → **Variables**
2. Verifica que `PG_DATABASE_URL` tenga el valor correcto
3. Si no existe, créala con el valor de arriba
4. Elimina `PG_DATABASE_HOST` y `PG_DATABASE_PORT` si existen

### 2. Verificar Comando del Worker

1. Ve a **Worker** → **Settings**
2. Busca **"Start Command"** o **"Command"**
3. Configura: `yarn worker:prod`
4. **Guarda** los cambios

### 3. Guardar y Esperar

1. **Guarda** todos los cambios
2. Railway redesplegará automáticamente
3. Espera 2-5 minutos
4. Revisa los logs del Worker

---

## ✅ Resultado Esperado

Después de configurar correctamente:

1. **Los logs del Worker** deben mostrar:
   - ✅ `[InstanceLoader]` - módulos cargándose
   - ✅ `Worker started successfully` o similar
   - ❌ NO debe aparecer `TypeError: Invalid URL`
   - ❌ NO debe aparecer `postgres://postgres:postgres@:/default`

2. **El Worker** debe estar corriendo sin crashear

---

## ⚠️ Notas Importantes

1. **El comando `yarn worker:prod`** ejecuta directamente `node dist/src/queue-worker/queue-worker.js` sin usar scripts intermedios
2. **NO uses** `render-worker.sh` - ese script está diseñado para Render, no Railway
3. **PG_DATABASE_URL** debe estar configurada directamente con la URL completa
4. **Las variables** deben estar configuradas ANTES de que el Worker inicie

---

## 🐛 Si el Error Persiste

Si después de configurar todo correctamente el error persiste:

1. **Verifica** que `PG_DATABASE_URL` no tenga espacios al inicio/final
2. **Verifica** que el comando sea exactamente `yarn worker:prod` (sin comillas)
3. **Verifica** que todas las variables obligatorias estén configuradas
4. **Elimina** cualquier variable `PG_DATABASE_HOST` o `PG_DATABASE_PORT`
5. **Revisa** los logs completos del Worker para ver si hay otros errores

---

## 📋 Checklist Final del Worker

- [ ] `PG_DATABASE_URL` configurada con URL completa
- [ ] `SERVER_URL` configurada
- [ ] `REDIS_URL` configurada
- [ ] `APP_SECRET` configurada
- [ ] `DISABLE_DB_MIGRATIONS=true`
- [ ] `NODE_ENV=production`
- [ ] `PG_DATABASE_HOST` eliminada (si existía)
- [ ] `PG_DATABASE_PORT` eliminada (si existía)
- [ ] Comando: `yarn worker:prod` configurado en Settings
- [ ] Worker redesplegado y corriendo sin errores







