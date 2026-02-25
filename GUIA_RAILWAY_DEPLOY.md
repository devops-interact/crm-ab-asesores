# 🚂 Guía Completa: Deploy en Railway

## 📋 Resumen de lo que necesitas

Para que Twenty funcione en Railway necesitas:
- **3 servicios**: Server, Worker, PostgreSQL, Redis
- **Variables de entorno** configuradas correctamente

---

## 🔧 PASO 1: Agregar Servicios en Railway

### 1.1 Agregar PostgreSQL

1. En tu proyecto Railway, haz clic en **"+ New"** o **"New Service"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará automáticamente un servicio PostgreSQL
4. **IMPORTANTE**: Anota el nombre del servicio (ej: `postgres` o `postgresql`)

### 1.2 Agregar Redis

1. Haz clic en **"+ New"** o **"New Service"** nuevamente
2. Selecciona **"Database"** → **"Add Redis"**
3. Railway creará automáticamente un servicio Redis
4. **IMPORTANTE**: Anota el nombre del servicio (ej: `redis`)

---

## 🔍 PASO 2: Obtener Variables de Entorno de Railway

### 2.1 Variables que Railway genera automáticamente

Cuando agregas PostgreSQL y Redis, Railway crea automáticamente estas variables:

#### Para PostgreSQL:
- `DATABASE_URL` o `POSTGRES_URL` (Railway puede usar cualquiera de estos nombres)
- Formato: `postgresql://usuario:password@host:puerto/database`

#### Para Redis:
- `REDIS_URL` (Railway la crea automáticamente)
- Formato: `redis://host:puerto` o `rediss://host:puerto`

### 2.2 Cómo encontrar estas variables

1. Ve a tu servicio **PostgreSQL** en Railway
2. Haz clic en la pestaña **"Variables"**
3. Busca `DATABASE_URL` o `POSTGRES_URL`
4. **Copia el valor completo** - lo necesitarás para `PG_DATABASE_URL`

5. Ve a tu servicio **Redis** en Railway
6. Haz clic en la pestaña **"Variables"**
7. Busca `REDIS_URL`
8. **Copia el valor completo**

---

## 🌐 PASO 3: Obtener SERVER_URL

### 3.1 Obtener la URL pública de Railway

1. Ve a tu servicio **Server** (el servicio principal de tu aplicación)
2. Haz clic en la pestaña **"Settings"**
3. Busca la sección **"Domains"** o **"Networking"**
4. Railway te asignará una URL automáticamente, algo como:
   - `tu-app-production.up.railway.app`
   - O si configuraste un dominio personalizado: `tu-dominio.com`

5. **Copia esta URL completa** (incluyendo `https://`)

**Ejemplo:**
```
https://crmdemo1-production.up.railway.app
```

### 3.2 Si aún no tienes dominio asignado

1. Railway asigna un dominio automáticamente después del primer deploy
2. Si no lo ves aún, espera a que termine el deploy
3. O ve a **Settings** → **Generate Domain** para forzar la creación

---

## 🔐 PASO 4: Generar APP_SECRET

`APP_SECRET` es una clave secreta que necesitas generar tú mismo.

### Opción 1: Usando PowerShell (Windows)
```powershell
# Genera una clave aleatoria de 32 caracteres
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Opción 2: Usando Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Opción 3: Usando un generador online
- Ve a: https://randomkeygen.com/
- Usa una clave de "CodeIgniter Encryption Keys" (64 caracteres)

**Ejemplo de APP_SECRET generado:**
```
aB3xK9mP2qR7vN5wT8yU1zA4bC6dE9fG0hI2jK3lM4nO5pQ6rS7tU8vW9xY0z
```

---

## ⚙️ PASO 5: Configurar Variables de Entorno

### 5.1 Variables para el Servicio SERVER

Ve a tu servicio **Server** → **Variables** y agrega:

| Variable | Valor | ¿De dónde viene? |
|----------|-------|------------------|
| `SERVER_URL` | `https://tu-app-production.up.railway.app` | Paso 3 - URL pública de Railway |
| `PG_DATABASE_URL` | `postgresql://...` (valor completo) | Paso 2.1 - Variable `DATABASE_URL` de PostgreSQL |
| `REDIS_URL` | `redis://...` (valor completo) | Paso 2.1 - Variable `REDIS_URL` de Redis |
| `APP_SECRET` | `tu-clave-generada` | Paso 4 - Clave que generaste |
| `NODE_ENV` | `production` | Valor fijo |
| `NODE_PORT` | `3000` | Valor fijo |
| `LOG_LEVEL` | `info` | Valor fijo (opcional) |

**Ejemplo de configuración:**
```
SERVER_URL=https://crmdemo1-production.up.railway.app
PG_DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
REDIS_URL=redis://default:password@containers-us-west-xxx.railway.app:6379
APP_SECRET=aB3xK9mP2qR7vN5wT8yU1zA4bC6dE9fG0hI2jK3lM4nO5pQ6rS7tU8vW9xY0z
NODE_ENV=production
NODE_PORT=3000
LOG_LEVEL=info
```

### 5.2 Variables para el Servicio WORKER

**IMPORTANTE**: Necesitas crear un servicio Worker separado.

1. Haz clic en **"+ New"** → **"Empty Service"** o clona tu servicio Server
2. Configura el comando de inicio: `yarn worker:prod`
3. Ve a **Variables** y agrega las **mismas variables** que el Server, EXCEPTO:

| Variable | Valor | Notas |
|----------|-------|-------|
| `SERVER_URL` | `https://tu-app-production.up.railway.app` | **Mismo que Server** |
| `PG_DATABASE_URL` | `postgresql://...` | **Mismo que Server** |
| `REDIS_URL` | `redis://...` | **Mismo que Server** |
| `APP_SECRET` | `tu-clave-generada` | **Mismo que Server** |
| `DISABLE_DB_MIGRATIONS` | `true` | **Solo para Worker** |
| `NODE_ENV` | `production` | Valor fijo |
| `LOG_LEVEL` | `info` | Valor fijo (opcional) |

**DIFERENCIAS del Worker:**
- ✅ Agrega `DISABLE_DB_MIGRATIONS=true` (el worker NO ejecuta migraciones)
- ✅ NO necesita `NODE_PORT` (el worker no escucha puertos)
- ✅ Comando: `yarn worker:prod`

---

## 📝 PASO 6: Configurar Comandos de Inicio

### 6.1 Servicio Server

1. Ve a tu servicio **Server** → **Settings**
2. Busca **"Start Command"** o **"Command"**
3. Déjalo vacío o usa: `yarn start` (el Dockerfile ya tiene el comando por defecto)

### 6.2 Servicio Worker

1. Ve a tu servicio **Worker** → **Settings**
2. Busca **"Start Command"** o **"Command"**
3. Configura: `yarn worker:prod`

---

## 🔄 PASO 7: Verificar y Redesplegar

1. **Verifica** que todas las variables estén configuradas correctamente
2. **Guarda** los cambios en Railway
3. Railway **redesplegará automáticamente** cuando detecte cambios
4. **Espera** a que termine el deploy (puede tomar 2-5 minutos)
5. **Revisa los logs** para verificar que no hay errores

---

## ✅ Checklist Final

Antes de considerar el deploy completo, verifica:

### Servicios creados:
- [ ] Servicio Server configurado
- [ ] Servicio Worker configurado
- [ ] Servicio PostgreSQL agregado
- [ ] Servicio Redis agregado

### Variables del Server:
- [ ] `SERVER_URL` configurada con URL pública
- [ ] `PG_DATABASE_URL` configurada (desde PostgreSQL)
- [ ] `REDIS_URL` configurada (desde Redis)
- [ ] `APP_SECRET` generada y configurada
- [ ] `NODE_ENV=production`
- [ ] `NODE_PORT=3000`

### Variables del Worker:
- [ ] `SERVER_URL` configurada (misma que Server)
- [ ] `PG_DATABASE_URL` configurada (misma que Server)
- [ ] `REDIS_URL` configurada (misma que Server)
- [ ] `APP_SECRET` configurada (misma que Server)
- [ ] `DISABLE_DB_MIGRATIONS=true`
- [ ] Comando: `yarn worker:prod`

### Verificación:
- [ ] Los logs del Server no muestran errores
- [ ] Los logs del Worker no muestran errores
- [ ] Puedes acceder a la aplicación en `SERVER_URL`

---

## 🐛 Solución de Problemas Comunes

### Error: "SERVER_URL must be a URL address"
- ✅ Verifica que `SERVER_URL` tenga el formato correcto: `https://dominio.com`
- ✅ No debe terminar con `/`
- ✅ Debe incluir el protocolo (`https://` o `http://`)

### Error: "Invalid URL" en PostgreSQL
- ✅ Verifica que `PG_DATABASE_URL` tenga el formato completo
- ✅ Debe ser: `postgresql://usuario:password@host:puerto/database`
- ✅ Copia el valor completo de `DATABASE_URL` de Railway

### Error: "Config variables validation failed"
- ✅ Verifica que todas las variables obligatorias estén configuradas
- ✅ Revisa que los valores no tengan espacios al inicio/final
- ✅ Verifica que `APP_SECRET` tenga al menos 32 caracteres

### Worker crashea inmediatamente
- ✅ Verifica que el comando sea: `yarn worker:prod`
- ✅ Verifica que tenga `DISABLE_DB_MIGRATIONS=true`
- ✅ Verifica que tenga las mismas variables que el Server

---

## 📚 Referencias

- [Documentación de Railway](https://docs.railway.app/)
- [Railway PostgreSQL](https://docs.railway.app/databases/postgresql)
- [Railway Redis](https://docs.railway.app/databases/redis)
- [Twenty Self-Hosting Docs](https://docs.twenty.com/developers/self-hosting)

---

## 💡 Notas Importantes

1. **Railway puede tardar** unos minutos en asignar el dominio público
2. **Las variables se comparten** entre servicios del mismo proyecto en Railway
3. **APP_SECRET debe ser único** y no compartirlo públicamente
4. **El Worker y Server** deben usar el mismo `APP_SECRET` para funcionar correctamente
5. **Las migraciones** solo se ejecutan en el Server, por eso el Worker tiene `DISABLE_DB_MIGRATIONS=true`







