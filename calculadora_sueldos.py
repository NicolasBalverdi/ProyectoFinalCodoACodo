import mysql.connector

class CalculadoraSueldos:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        self.cursor = self.conn.cursor(dictionary=True)

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS empleados (
            id INT PRIMARY KEY AUTO_INCREMENT,
            nombre VARCHAR(255) NOT NULL,
            apellido VARCHAR(255) NOT NULL,
            categoria VARCHAR(50) NOT NULL,
            dni VARCHAR(20) NOT NULL,
            legajo VARCHAR(20) NOT NULL
        );''')
        self.conn.commit()

    def agregar_empleado(self, legajo, nombre, apellido, dni, categoria):
        # Verificamos si ya existe un producto con el mismo código
        self.cursor.execute(f"SELECT * FROM productos WHERE codigo = {legajo};")
        producto_existe = self.cursor.fetchone()
        if producto_existe:
            return False
        sql = "INSERT INTO empleados (legajo, nombre, apellido, dni, categoria) VALUES (%s, %s, %s, %s, %s);"
        valores = (legajo, nombre, apellido, dni, categoria)

        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid

    def listar_empleados(self):
        self.cursor.execute("SELECT * FROM empleados;")
        empleados = self.cursor.fetchall()
        return empleados

    def consultar_empleado(self, legajo):
        self.cursor.execute(f"SELECT * FROM empleados WHERE id = {legajo};")
        return self.cursor.fetchone()
    
    def modificar_empleado(self, legajo, nombre, apellido, dni, categoria):
        sql = "UPDATE empleados SET nombre = %s, apellido = %s, dni = %s, categoria = %s WHERE legajo = %s;"
        valores = (nombre, apellido, dni, categoria, legajo)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        
        return self.cursor.rowcount > 0
    

    def eliminar_empleado(self, legajo):
        self.cursor.execute(f"DELETE FROM empleados WHERE id = {legajo};")
        self.conn.commit()
        return True
    
    def mostrar_empleado(self, legajo):
        # Mostramos los datos de un producto a partir de su código
        empleado = self.consultar_empleado(legajo)
        if empleado:
            print("-" * 40)
            print(f"Legajo.....: {empleado['legajo']}")
            print(f"Nombre.....: {empleado['nombre']}")
            print(f"Apellido...: {empleado['apellido']}")
            print(f"DNI........: {empleado['dni']}")
            print(f"Categoria..: {empleado['categoria']}")
            print("-" * 40)
        else:
            print("Empleado no encontrado.")