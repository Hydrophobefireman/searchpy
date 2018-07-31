import json
from urllib.parse import unquote, unquote_plus

from flask import (
    Flask,
    Response,
    make_response,
    redirect,
    abort,
    render_template,
    request,
    send_from_directory,
)
from flask_compress import Compress
from htmlmin.minify import html_minify

import apIo

api = apIo.Api()
app = Flask(__name__)
Compress(app)
user_agent = apIo._useragent


@app.route("/")
def index():
    return html_minify(render_template("index.html"))


@app.route("/search")
def search():
    query = request.args.get("q")
    if not query:
        return html_minify(render_template("index.html"))
    return html_minify(render_template("search.html", query=query))


@app.route("/url")
def redirect_no_referer():
    url = request.args.get("url")
    if not url:
        abort(400)
    return html_minify(render_template("redirect.html", url=url))


@app.route("/search/get_results/", methods=["GET"])
def scrape_results():
    query = request.args.get("q")
    if not query:
        return redirect("/search")
    google = api.google(query)
    bing = api.bing(query)
    res = make_response(json.dumps({"google": google, "bing": bing}))
    res.headers["Content-Type"] = "application/json"
    return res


if __name__ == "__main__":
    app.run(debug=True)
