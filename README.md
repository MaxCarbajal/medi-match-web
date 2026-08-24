# Health Compass

# Sistema Inteligente de Recomendación de Proveedores Médicos

## Prompt para Lovable

# Contexto

Quiero desarrollar una aplicación web moderna utilizando **Lovable** como generador de la interfaz y **Supabase** como backend (Base de datos, Autenticación y API).

La aplicación forma parte de un Trabajo Fin de Máster (TFM) y tiene como objetivo construir un **Sistema Inteligente de Recomendación de Proveedores Médicos** que ayude al operador de una aseguradora durante el proceso de autorización de un siniestro de salud.

El sistema debe recomendar automáticamente las mejores clínicas o proveedores para atender al paciente utilizando diferentes variables de negocio.

El proyecto está diseñado para que posteriormente pueda conectarse a un modelo de Machine Learning mediante una API REST.

---

# Objetivo del sistema

El operador registra la información del siniestro.

Una vez enviada la información, el sistema consulta un motor de recomendación y devuelve un ranking de proveedores médicos ordenados desde la mejor opción hasta la menos recomendable.

Cada recomendación debe ser explicable, transparente y auditable.

No se debe mostrar únicamente un puntaje.

Debe mostrarse claramente el motivo por el cual la clínica fue recomendada.

---

# Tecnologías

Frontend

- Lovable

- React

- TypeScript

- TailwindCSS

- Shadcn UI

Backend

- Supabase

    - PostgreSQL

    - Authentication

    - Storage

    - Edge Functions

Preparar la arquitectura para consumir una API REST denominada:

POST

/api/recommendations

aunque inicialmente se utilizarán datos simulados (mock).

---

# Diseño

Quiero un diseño profesional similar a un software corporativo.

Inspirado en:

- Salesforce

- HubSpot

- Monday

- Jira

Colores:

- Blanco

- Gris claro

- Azul corporativo

Mucho espacio en blanco.

Cards con sombras suaves.

Bordes redondeados.

Diseño responsive.

---

# Flujo de usuario

## Paso 1

Mostrar un formulario para registrar el siniestro.

Debe contener las siguientes secciones.

## Datos del asegurado

- Número de póliza

- Documento

- Nombre

- Parentesco

## Datos del siniestro

- Ciudad

- Fecha

- Producto

- Diagnóstico

- Observaciones

## Servicio solicitado

- Tratamiento

- Tipo de servicio

    - Programado

    - Urgencia

Botón principal:

Buscar proveedores recomendados

---

# Comportamiento

Al presionar el botón:

Buscar proveedores recomendados

Mostrar un spinner de carga.

Simular una llamada REST.

Mientras tanto mostrar el mensaje:

"Analizando disponibilidad de proveedores..."

---

# Pantalla de resultados

Mostrar una lista ordenada de recomendaciones.

Cada proveedor debe aparecer dentro de una Card.

Cada Card debe contener:

Nombre de la clínica

Especialidad

Ciudad

Distancia

Costo estimado

Tiempo de respuesta

Capacidad disponible

Calificación Google

Score de recomendación

Botón

Ver detalle

---

# Explicabilidad

Esta es la parte más importante del proyecto.

Cada proveedor debe mostrar una explicación de la recomendación.

Ejemplo:

¿Por qué recomendamos esta clínica?

✔ Excelente relación costo-beneficio

✔ Alta disponibilidad para atención inmediata

✔ Se encuentra a solo 3.2 km del paciente

✔ Calificación Google de 4.8/5

✔ Especializada en el tratamiento solicitado

✔ Históricamente presenta baja tasa de rechazos

✔ Convenio preferencial con la aseguradora

Esta explicación debe verse visualmente atractiva mediante badges o checklist.

---

# Ranking

El primer proveedor debe destacar visualmente.

Agregar un Badge

🏆 Mejor opción

Los demás deben indicar

#2

#3

#4

etc.

---

# Panel de puntuación

Cada proveedor debe mostrar un resumen del score.

Ejemplo

Score total

94/100

Debajo mostrar una barra de progreso.

Además mostrar cómo se calculó.

Costo

25%

Distancia

20%

Capacidad

15%

Especialización

20%

Google Reviews

10%

Historial

10%

---

# Historial

Guardar cada búsqueda realizada en Supabase.

Tabla

recommendation_requests

Campos

id

fecha

usuario

poliza

paciente

ciudad

tratamiento

tipo_servicio

json_request

json_response

---

# Mock Data

Mientras no exista el modelo de IA utilizar datos simulados.

Ejemplo

[

{

"id":1,

"hospital":"Clínica Caracas",

"score":95,

"distance":2.3,

"google":4.8,

"capacity":"Alta",

"cost":"$$",

"reason":[

"Costo óptimo",

"Excelente disponibilidad",

"Alta valoración",

"Especialistas certificados"

]

},

{

"id":2,

"hospital":"Centro Médico La Trinidad",

"score":91,

"distance":4.2,

"google":4.7,

"capacity":"Media",

"cost":"$$$",

"reason":[

"Especialistas disponibles",

"Alta calidad",

"Muy buenas opiniones"

]

}

]

---

# Arquitectura

Organizar el proyecto utilizando componentes reutilizables.

pages/

components/

services/

hooks/

types/

lib/

utils/

---

# Componentes

Crear componentes independientes.

ClaimForm

RecommendationCard

RecommendationList

RecommendationScore

RecommendationReasons

LoadingOverlay

EmptyState

Header

Sidebar

TopBar

---

# Futuro

Preparar la arquitectura para que posteriormente el frontend pueda consumir un modelo de Machine Learning mediante una API.

El endpoint devolverá un JSON similar a:

{

"recommendations":[

{

"id":15,

"name":"Hospital Metropolitano",

"score":96,

"reasons":[...]

}

]

}

No acoplar la lógica al mock.

Toda la información debe obtenerse desde un servicio llamado

RecommendationService.ts

---

# Objetivo UX

El operador debe poder completar el formulario en menos de dos minutos.

Los resultados deben ser claros.

Visuales.

Explicables.

Auditables.

El sistema debe transmitir confianza y justificar cada recomendación para facilitar la toma de decisiones del operador.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://health-choice-advisor.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/df9b746f-3862-40f4-bd21-d19b56530db2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
