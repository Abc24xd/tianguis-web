/*
  # Crear tabla de productos para tianguis

  1. Nueva Tabla
    - `products` (productos)
      - `id` (uuid, primary key) - Identificador único del producto
      - `name` (text) - Nombre del producto
      - `description` (text) - Descripción del producto
      - `price` (decimal) - Precio del producto en pesos
      - `image_url` (text) - URL de la imagen del producto
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de última actualización
  
  2. Seguridad
    - Habilitar RLS en la tabla `products`
    - Permitir a todos (público) VER los productos (SELECT)
    - Solo administradores autenticados pueden AGREGAR productos (INSERT)
    - Solo administradores autenticados pueden ACTUALIZAR productos (UPDATE)
    - Solo administradores autenticados pueden ELIMINAR productos (DELETE)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan ver los productos (público)
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

-- Política para que solo administradores puedan agregar productos
CREATE POLICY "Authenticated admins can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para que solo administradores puedan actualizar productos
CREATE POLICY "Authenticated admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para que solo administradores puedan eliminar productos
CREATE POLICY "Authenticated admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);