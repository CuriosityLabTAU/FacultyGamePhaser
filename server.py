from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn
import threading
import os
from datetime import datetime
import json


# a class to make each request a different thread
class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""


# a class for handling https requests
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    # handles CORS - since the front end sends request from the same IP
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        BaseHTTPRequestHandler.end_headers(self)

    # GET REST requests
    def do_GET(self):
        print(self.path, threading.currentThread().getName())
        full_path = self.path.split('/')
        file_name = full_path[-1]
        file_type = file_name.split('.')[-1]

        print(file_name, file_type)
        self.send_response(200)
        self.send_header('Content-type', 'application/octet-stream') # + file_type)
        self.send_header('Content-Disposition', 'attachment; filename="' + file_name + '"')
        self.end_headers()

        with open('.' + self.path, 'rb') as file:
            self.wfile.write(file.read())  # Read the file
        print('done')


def start_teacher_server():
    httpd = ThreadedHTTPServer(('', 4000), SimpleHTTPRequestHandler)

    print('started teacher server on port: ', 4000)

    httpd.serve_forever()

start_teacher_server()