from flask import Flask, request, jsonify, render_template
from flask import redirect, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename
from calculadora_sueldos import CalculadoraSueldos

import os
import time

app = Flask(__name__)
CORS(app)


catalogo = CalculadoraSueldos(host='localhost', user='root', password='', database='miapp')


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/empleados')
def empleados_html():
    return render_template('empleados.html')

@app.route('/modificar_empleado')
def modificar_empleado_html():
    return render_template('modificar_empleado.html')

@app.route('/borrar_empleado')
def borrar_empleado_html():
    return render_template('borrar_empleado.html')



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
    legajo = request.form.get('legajo')
    nombre = request.form.get('nombre')
    apellido = request.form.get('apellido')
    dni = request.form.get('dni')
    categoria = request.form.get('categoria')

    if catalogo.agregar_empleado(legajo, nombre, apellido, dni, categoria):
        return jsonify({"mensaje": "Empleado agregado"}), 201
    else:
        return jsonify({"mensaje": "Empleado ya existe"}), 400

@app.route('/modificar_empleado', methods=['POST'])
def modificar_empleado():
    legajo = request.form.get('legajo_modificar')
    nuevo_nombre = request.form.get('nombre')
    nuevo_apellido = request.form.get('apellido')
    nuevo_dni = request.form.get('dni')
    nueva_categoria = request.form.get('categoria')

    if catalogo.consultar_empleado(legajo):
        if catalogo.modificar_producto(legajo, nuevo_nombre, nuevo_apellido, nuevo_dni, nueva_categoria):
            return jsonify({'mensaje': 'empleado modificado'}), 201
    else:
        return jsonify({'mensaje': 'empleado no modificado'}),400

@app.route('/borrar_empleado', methods=['POST'])
def borrar_empleado():
    legajo = request.form.get('legajo')
    if legajo:
        empleado_existente = catalogo.consultar_empleado(legajo)

        if empleado_existente:
            catalogo.eliminar_empleado(legajo)
            return jsonify({"mensaje": "Empleado eliminado"}), 200
        else:
            return jsonify({"mensaje": "Empleado no encontrado"}), 404
    else:
        return jsonify({"mensaje": "ID de empleado no proporcionado"}), 400
    

if __name__ == "__main__":
    app.run(debug=True)
