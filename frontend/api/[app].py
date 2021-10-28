import html
import json
from os.path import isdir

from flask import Flask, abort, make_response, redirect, render_template, request

try:
    from . import apIo
except ImportError:
    import apIo
try:
    from . import scrape
except ImportError:
    import scrape

api = apIo.Api()
app = Flask(__name__)
user_agent = apIo.USER_AGENT

if not isdir("static"):
    from os.path import join

    app.static_folder = join("..", "static")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/search")
def search():
    query = request.args.get("q")
    _start = request.args.get("start") or 0
    start = int(_start)
    if not query:
        return render_template("index.html")
    query = html.unescape(query)
    return render_template("search.html", query=query, start=start)


@app.after_request
def cors___(res):
    res.direct_passthrough = False
    res.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
    res.headers["Access-Control-Allow-Headers"] = "*"
    return res


@app.route("/api/images-search/", strict_slashes=False)
@app.route("/images/search/", strict_slashes=False)
def images_():
    _query = request.args.get("q")
    query = html.unescape(_query) if _query else False
    if not query:
        return render_template("images.html", query="", bing={}, google={})
    google = api.google_images(query)["data"]
    bing = api.bing_images(query)["data"]
    return render_template(
        "images.html", query=query, bing=json.dumps(bing), google=json.dumps(google)
    )


@app.route("/api/images-get", strict_slashes=False)
@app.route("/images/get/", strict_slashes=False)
def get_images():
    query = request.args.get("q")
    if query is None or len(query) == 0:
        return "No"
    query = html.unescape(query)
    try:
        res = make_response(
            json.dumps(
                {
                    "data": {
                        "google": api.google_images(query)["data"],
                        "bing": api.bing_images(query)["data"],
                    }
                }
            )
        )
    except Exception as e:
        return {"error": str(e)}
    res.headers["Content-Type"] = "application/json"
    res.headers["Access-Control-Allow-Origin"] = "*"
    return res


# @app.route("/debug/images/", strict_slashes=False)
# def deb_img():
#     return api.google_images(html.unescape(request.args.get("q")), debug=True)


@app.route("/api/url", strict_slashes=False)
@app.route("/url")
def redirect_no_referer():
    url = request.args.get("url")
    if not url:
        abort(400)
    return render_template("redirect.html", url=url)


@app.route("/api/search-get_results/", methods=["GET"], strict_slashes=False)
@app.route("/search/get_results/", methods=["GET"])
def scrape_results():
    query = request.args.get("q")
    if not query:
        return redirect("/search")
    query = html.unescape(query)
    _start = request.args.get("start") or "0"
    start = int(_start) if _start.isdigit() else 0
    google = api.google(query, page_start=start)
    bing = api.bing(query, page_start=start)
    obj = {"google": google, "bing": bing}
    res = make_response(json.dumps({"data": obj} if request.args.get("uilib") else obj))
    res.headers["Content-Type"] = "application/json"
    return res


@app.route("/api/get-<_engine>/", strict_slashes=False)
@app.route("/search/get/<_engine>/", strict_slashes=False)
def specific_engine(_engine):
    query = request.args.get("q")
    if not query:
        return redirect("/search")
    query = html.unescape(query)
    _start = request.args.get("start") or 0
    start = int(_start) if _start.isdigit() else 0
    engine = _engine.lower()
    if not hasattr(api, engine):
        return "None"
    data = getattr(api, engine)(query, page_start=start)
    obj = {engine: data}
    res = make_response(json.dumps({"data": obj} if request.args.get("uilib") else obj))
    res.headers["Content-Type"] = "application/json"
    return res


if __name__ == "__main__":
    app.run(debug=True)
