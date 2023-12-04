from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

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

    def agregar_empleado(self, nombre, apellido, categoria, dni, legajo):
        sql = "INSERT INTO empleados (nombre, apellido, categoria, dni, legajo) VALUES (%s, %s, %s, %s, %s);"
        valores = (nombre, apellido, categoria, dni, legajo)

        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid

    def listar_empleados(self):
        self.cursor.execute("SELECT * FROM empleados;")
        empleados = self.cursor.fetchall()
        return empleados

    def consultar_empleado(self, id_empleado):
        self.cursor.execute(f"SELECT * FROM empleados WHERE id = {id_empleado};")
        return self.cursor.fetchone()

    def eliminar_empleado(self, id_empleado):
        self.cursor.execute(f"DELETE FROM empleados WHERE id = {id_empleado};")
        self.conn.commit()
        return True

catalogo = CalculadoraSueldos(host='localhost', user='root', password='', database='miapp')

@app.route('/empleados')
def empleados_html():
    return render_template('empleados.html')

@app.route("/empleados", methods=["GET"])
def listar_empleados():
    empleados = catalogo.listar_empleados()
    return jsonify(empleados)

@app.route("/empleados/<int:id_empleado>", methods=["GET"])
def mostrar_empleado(id_empleado):
    empleado = catalogo.consultar_empleado(id_empleado)
    if empleado:
        return jsonify(empleado)
    else:
        return "Empleado no encontrado", 404

@app.route("/empleados", methods=["POST"])
def agregar_empleado():
    nombre = request.form.get('nombre')
    apellido = request.form.get('apellido')
    categoria = request.form.get('categoria')
    dni = request.form.get('dni')
    legajo = request.form.get('legajo')

    id_empleado = catalogo.agregar_empleado(nombre, apellido, categoria, dni, legajo)
    nuevo_empleado = catalogo.consultar_empleado(id_empleado)

    return jsonify({"mensaje": "Empleado agregado", "nuevo_empleado": nuevo_empleado}), 201

@app.route('/borrar_empleado', methods=['POST'])
def borrar_empleado():
    id_empleado = request.form.get('id_empleado')
    if id_empleado:
        empleado_existente = catalogo.consultar_empleado(id_empleado)

        if empleado_existente:
            catalogo.eliminar_empleado(id_empleado)
            return jsonify({"mensaje": "Empleado eliminado"}), 200
        else:
            return jsonify({"mensaje": "Empleado no encontrado"}), 404
    else:
        return jsonify({"mensaje": "ID de empleado no proporcionado"}), 400

if __name__ == "__main__":
    app.run(debug=True)
