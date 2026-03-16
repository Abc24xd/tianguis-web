# Catálogo de Productos del Tianguis - Zitácuaro, Michoacán

Página web moderna para el negocio de tianguis ubicado en Zitácuaro, Michoacán.

## Características

- ✅ Catálogo de productos con imágenes, nombres, descripciones y precios
- ✅ Sistema de carrito de compras
- ✅ Pedidos por WhatsApp (recoger en domicilio o entrega a domicilio)
- ✅ Panel de administración para gestionar productos
- ✅ Autenticación segura para administradores
- ✅ Diseño responsive (funciona en celular, tablet y computadora)
- ✅ Mapa de ubicación integrado
- ✅ Botón flotante de WhatsApp

## Tecnologías

- Vite + JavaScript
- Supabase (base de datos y autenticación)
- HTML5 + CSS3

## Instrucciones de Uso

### Para Clientes

1. Los clientes pueden ver el catálogo sin necesidad de iniciar sesión
2. Pueden agregar productos al carrito usando el botón "Agregar"
3. Ver el carrito haciendo clic en el botón flotante con el ícono de carrito 🛒
4. Elegir entre:
   - **Recoger en domicilio**: El pedido se envía por WhatsApp para coordinar la recogida
   - **Pedir a domicilio**: El pedido se envía por WhatsApp para coordinar la entrega

### Para Administradores

#### Crear Cuenta de Administrador

Para crear tu primera cuenta de administrador, sigue estos pasos:

1. Abre Supabase Dashboard: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Authentication" en el menú lateral
4. Haz clic en "Add user" → "Create new user"
5. Ingresa:
   - Email: tu correo electrónico
   - Password: una contraseña segura
6. Haz clic en "Create user"

#### Acceder al Panel de Administración

1. Ve a la página `/admin.html`
2. Inicia sesión con tu correo y contraseña
3. Una vez dentro, podrás:
   - ✅ Ver todos los productos
   - ✅ Agregar nuevos productos
   - ✅ Editar productos existentes
   - ✅ Eliminar productos

#### Agregar un Producto

1. Haz clic en el botón "+ Agregar Producto"
2. Completa el formulario:
   - **Nombre**: Nombre del producto
   - **Descripción**: Descripción breve (opcional)
   - **Precio**: Precio en pesos mexicanos
   - **URL de imagen**: Link de la imagen del producto
3. Haz clic en "Guardar"

**Sugerencia**: Puedes usar imágenes gratuitas de:
- Pexels: https://www.pexels.com/es-es/
- Unsplash: https://unsplash.com/

## Información del Negocio

- **Nombre**: Catálogo de Productos del Tianguis
- **Ubicación**: Crecencio Morales, Lázaro Cárdenas Sur 90, Benito Juárez, 61517 Zitácuaro, Michoacán
- **WhatsApp**: 715 131 2918

## Personalización

### Cambiar el número de WhatsApp

Edita el archivo `src/main.js` y cambia la constante:

```javascript
const WHATSAPP_NUMBER = '527151312918';
```

### Cambiar la ubicación del mapa

Edita el archivo `index.html` y actualiza el iframe de Google Maps con las coordenadas correctas de tu negocio.

## Productos de Ejemplo

La aplicación viene con 8 productos de ejemplo que puedes modificar o eliminar desde el panel de administración:

1. Tenis Deportivos
2. Ventilador de Mesa
3. Sillas Plegables
4. Mesa de Plástico
5. Toldo para Sol
6. Utensilios de Cocina
7. Mochilas Escolares
8. Juguetes para Niños

## Soporte

Si necesitas ayuda o tienes preguntas, contacta al WhatsApp: 715 131 2918
