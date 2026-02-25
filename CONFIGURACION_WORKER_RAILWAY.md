# ⚙️ Configuración Exacta del Worker en Railway

## ⚠️ IMPORTANTE: Sobre la Advertencia de Railway

Cuando Railway muestra la advertencia **"Warning: Database configuration change"**, es porque estás intentando editar `PG_DATABASE_HOST`, que Railway maneja automáticamente.

**SOLUCIÓN**: Twenty **NO usa** `PG_DATABASE_HOST`. Necesitas usar `PG_DATABASE_URL` completa.

---

## ✅ Variables que DEBES tener en el Worker

### Variables OBLIGATORIAS (agregar/verificar):

```bash
SERVER_URL=https://server-production-fdc1.up.railway.app
PG_DATABASE_URL=postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
REDIS_URL=redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597
APP_SECRET=ksjf9823HJS98hd98HADH989dsadJASD
DISABLE_DB_MIGRATIONS=true
NODE_ENV=production
```

### Variables OPCIONALES (pero recomendadas):

```bash
FRONTEND_URL=https://server-production-fdc1.up.railway.app
LOG_LEVEL=info
```

---

## ❌ Variables que NO necesitas (puedes eliminarlas)

- `PG_DATABASE_HOST` - **NO la necesitas**, Twenty usa `PG_DATABASE_URL` completa
- `FRONT_BASE_URL` - Puedes dejarla si Railway la creó automáticamente, pero Twenty usa `FRONTEND_URL`

---

## 📝 Pasos Exactos para Configurar el Worker

### Paso 1: Eliminar o Ignorar PG_DATABASE_HOST

1. Si ves `PG_DATABASE_HOST` en las variables:
   - **Opción A**: Elimínala (haz clic en los 3 puntos → Delete)
   - **Opción B**: Si Railway no te deja eliminarla, déjala ahí pero **NO la edites**

2. Si Railway muestra la advertencia al intentar editar `PG_DATABASE_HOST`:
   - Haz clic en **"Cancel"**
   - **NO edites** `PG_DATABASE_HOST` - no la necesitas

### Paso 2: Agregar las Variables Faltantes

Haz clic en **"+ New Variable"** y agrega estas variables **UNA POR UNA**:

#### 1. PG_DATABASE_URL
```
Nombre: PG_DATABASE_URL
Valor: postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway
```

#### 2. REDIS_URL
```
Nombre: REDIS_URL
Valor: redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597
```

#### 3. DISABLE_DB_MIGRATIONS
```
Nombre: DISABLE_DB_MIGRATIONS
Valor: true
```

#### 4. NODE_ENV
```
Nombre: NODE_ENV
Valor: production
```

#### 5. FRONTEND_URL (opcional pero recomendado)
```
Nombre: FRONTEND_URL
Valor: https://server-production-fdc1.up.railway.app
```

#### 6. LOG_LEVEL (opcional)
```
Nombre: LOG_LEVEL
Valor: info
```

### Paso 3: Verificar Variables Existentes

Verifica que estas variables ya estén configuradas (deberían estar de antes):

- ✅ `SERVER_URL` = `https://server-production-fdc1.up.railway.app`
- ✅ `APP_SECRET` = `ksjf9823HJS98hd98HADH989dsadJASD`

### Paso 4: Configurar el Comando del Worker

1. Ve a **Worker** → **Settings**
2. Busca **"Start Command"** o **"Command"**
3. Configura: `yarn worker:prod`
4. **Guarda** los cambios

---

## ✅ Lista Final de Variables del Worker

Tu Worker debe tener estas variables:

| Variable | Valor | Estado |
|----------|-------|--------|
| `SERVER_URL` | `https://server-production-fdc1.up.railway.app` | ✅ Ya la tienes |
| `PG_DATABASE_URL` | `postgresql://postgres:gLBHARJhPtfkldkEWnGREJNMiQueSQWK@postgres.railway.internal:5432/railway` | ⚠️ **AGREGAR** |
| `REDIS_URL` | `redis://default:YxTZmUbznHbSBAwiXBUISezQogEEKndB@shinkansen.proxy.rlwy.net:26597` | ⚠️ **AGREGAR** |
| `APP_SECRET` | `ksjf9823HJS98hd98HADH989dsadJASD` | ✅ Ya la tienes |
| `DISABLE_DB_MIGRATIONS` | `true` | ⚠️ **AGREGAR** |
| `NODE_ENV` | `production` | ⚠️ **AGREGAR** |
| `FRONTEND_URL` | `https://server-production-fdc1.up.railway.app` | ⚠️ **AGREGAR** (opcional) |
| `LOG_LEVEL` | `info` | ⚠️ **AGREGAR** (opcional) |

---

## 🔍 Sobre FRONT_BASE_URL vs FRONTEND_URL

- Railway puede crear `FRONT_BASE_URL` automáticamente
- Twenty usa `FRONTEND_URL` internamente
- **Solución**: Agrega `FRONTEND_URL` con el mismo valor que `SERVER_URL`
- Puedes dejar `FRONT_BASE_URL` si Railway la creó, pero asegúrate de tener `FRONTEND_URL`

---

## ⚠️ Sobre la Advertencia de Railway

**¿Por qué aparece la advertencia?**

Railway detecta que estás intentando editar variables relacionadas con la base de datos (`PG_DATABASE_HOST`), y te advierte porque normalmente estas variables se gestionan automáticamente cuando conectas un servicio de base de datos.

**¿Qué hacer?**

1. **NO edites** `PG_DATABASE_HOST` - no la necesitas
2. En su lugar, agrega `PG_DATABASE_URL` completa (como se muestra arriba)
3. Si Railway insiste en mostrar la advertencia, haz clic en **"Cancel"** y continúa agregando las otras variables

---

## 🎯 Resumen Rápido

**Lo que tienes ahora:**
- ✅ APP_SECRET
- ✅ FRONT_BASE_URL (Railway la creó)
- ⚠️ PG_DATABASE_HOST (Railway la creó, pero NO la necesitas)
- ✅ SERVER_URL

**Lo que necesitas AGREGAR:**
- ⚠️ PG_DATABASE_URL (URL completa)
- ⚠️ REDIS_URL
- ⚠️ DISABLE_DB_MIGRATIONS=true
- ⚠️ NODE_ENV=production
- ⚠️ FRONTEND_URL (opcional)
- ⚠️ LOG_LEVEL=info (opcional)

**Lo que NO necesitas:**
- ❌ PG_DATABASE_HOST (puedes eliminarla o ignorarla)

---

## ✅ Después de Configurar

1. **Guarda** todos los cambios
2. Railway redesplegará automáticamente
3. Espera 2-5 minutos
4. Revisa los logs del Worker
5. Debe decir algo como: "Worker started successfully"







