import cherrypy
import os
import base64
import tempfile

class Faceswap(object):

    @cherrypy.expose
    def index(self):
        return cherrypy.lib.static.serve_file(os.path.join(current_dir, "index.html"))

    @cherrypy.expose
    def query(self, data):
        suffix, img_data = self.decode(data)
        file = tempfile.NamedTemporaryFile(dir = tmp_dir, delete=False, suffix="."+suffix)
        print "[TempFile] Created file %s"%(file.name)
        file.write(img_data)

    def decode(self, data):
        meta, raw_data = data.split(",")
        mime, encoding = meta.split(";")
        data_type, suffix = mime.split("/")
        return suffix, base64.b64decode(raw_data)

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    tmp_dir = os.path.join(current_dir, "tmp")
    config = {
            "/static": {
                "tools.staticdir.on": True,
                "tools.staticdir.dir": os.path.join(current_dir, "static/")
                }
            }
    cherrypy.quickstart(Faceswap(), "/", config)
