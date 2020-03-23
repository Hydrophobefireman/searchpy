(function() {
  if (typeof self === "undefined") {
    var self = window;
  }
  const loadingImageSrc = document
    .querySelector("meta[loading-img]")
    .getAttribute("content");
  const { Component, h, render } = self.uiLib;
  const _ls = localStorage.getItem("data-config");
  const prefs = _ls ? JSON.parse(_ls) : { saveData: false, slideShow: false };
  const root = document.getElementById("root");
  const { bing: bingData, google: googleData, query } = self._initialData;
  function updateLocalstorage() {
    localStorage.setItem("data-config", JSON.stringify(prefs));
    dispatchEvent(new Event("config-change"));
  }
  class ImageViewer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        slideShowEnabled: prefs.slideShow,
        saveData: prefs.saveData
      };
    }
    _updateConfig = () => {
      this.setState({
        saveData: prefs.saveData,
        slideShowEnabled: prefs.slideShow
      });
      console.log(this.state);
    };
    componentDidMount() {
      addEventListener("config-change", this._updateConfig);
    }
    _setStartIndex = e => {
      prefs.slideShow = true;
      this.setState({
        startIndex: +e.target.dataset.index
      });
      updateLocalstorage();
    };
    render(props, state) {
      const { bingData, googleData } = props;
      const sendProps = {
        bingData,
        googleData,
        toggleSlideShow: this._updateConfig
      };
      return h(
        "div",
        null,
        state.slideShowEnabled
          ? h(SlideShow, { ...sendProps, startIndex: this.state.startIndex })
          : h(ImageGrid, { ...sendProps, setStartIndex: this._setStartIndex })
      );
    }
  }
  class SlideShow extends Component {
    constructor(props) {
      super(props);
      const { bingData, googleData, startIndex } = props;
      const allImages = [...bingData, ...googleData];
      this.state = {
        allImages,
        currentIndex: startIndex || 0,
        showLinkAndTitle: true,
        allImagesLength: allImages.length,
        _fakeData: { fallback: loadingImageSrc, img: loadingImageSrc },
        shouldShowSpinner: false
      };
    }
    _toggleShowLink = () =>
      this.setState(ps => ({ showLinkAndTitle: !ps.showLinkAndTitle }));
    _onClientImageClick = e => {
      const clickTarget = e.target;
      const clickTargetWidth = clickTarget.offsetWidth;
      const xCoordInClickTarget =
        e.clientX - clickTarget.getBoundingClientRect().left;
      this.setState(ps => {
        let newIndex;
        if (clickTargetWidth / 2 > xCoordInClickTarget) {
          newIndex = ps.currentIndex - 1;
          if (newIndex < 0) newIndex = 0;
        } else {
          newIndex = ps.currentIndex + 1;

          if (newIndex >= this.state.allImagesLength) {
            newIndex = 0;
          }
        }
        return { currentIndex: newIndex, shouldShowSpinner: true };
      });
    };
    _closeSlideShow = () => {
      prefs.slideShow = !prefs.slideShow;
      updateLocalstorage();
      this.props.toggleSlideShow();
    };
    _imgLoadedEvent = e => {
      this.setState({ shouldShowSpinner: false });
    };
    componentDidUpdate() {
      if (this.state.shouldShowSpinner) {
        this.setState({ shouldShowSpinner: false });
      }
    }
    render(props, state) {
      const data = state.shouldShowSpinner
        ? this.state._fakeData
        : state.allImages[state.currentIndex];
      return h(
        "div",
        { style: { display: "flex" } },

        h(
          "div",
          { class: "title-link-ss" },
          h(
            "a",
            {
              target: "_blank",
              href: data.link,
              class: `link-title-top${state.showLinkAndTitle ? "" : " hide"}`
            },
            data.title
          ),
          h("div", {
            class: `action-button back-button${
              state.showLinkAndTitle ? "" : " rotate"
            }`,
            onClick: this._toggleShowLink
          })
        ),
        h(
          "div",
          {
            class: "title-link-ss",
            style: { left: "unset", right: 0, padding: 0 }
          },
          h("div", {
            class: "action-button close-button",
            style: { margin: 0 },
            onClick: this._closeSlideShow
          })
        ),
        h(ImageComponent, {
          imgProps: data,
          class: "slideshow-image",
          onClick: this._onClientImageClick
        })
      );
    }
  }
  function ImageGrid(props) {
    const { bingData, googleData, setStartIndex } = props;
    const bLen = bingData.length;
    return h(
      "div",
      { class: "image-grid-box" },
      h(
        "div",
        { class: "bing images" },
        h("div", { style: { "font-weight": "bold" } }, "Bing Images"),
        h(
          "div",
          { class: "image-grid" },
          bingData.map((x, i) =>
            h(ImageComponent, {
              imgProps: x,
              "data-index": i,
              onClick: setStartIndex
            })
          )
        )
      ),
      h(
        "div",
        { class: "google images" },
        h("div", { style: { "font-weight": "bold" } }, "Google Images"),
        h(
          "div",
          { class: "image-grid" },
          googleData.map((x, i) =>
            h(ImageComponent, {
              imgProps: x,
              "data-index": bLen + i,
              onClick: setStartIndex
            })
          )
        )
      )
    );
  }
  class ImageComponent extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    _onError = () => this.setState({ hasError: true });
    _onClick = e => {};
    render(props, state) {
      const { imgProps, ..._props } = props;
      return h("img", {
        onerror: this._onError,
        onClick: this._onClick,
        class: "grid-image",
        src: state.hasError
          ? imgProps.fallback
          : prefs.saveData
          ? imgProps.fallback
          : imgProps.img,
        ..._props
      });
    }
  }
  class PropertyComponent extends Component {
    _togglePref = () => {
      this.setState(() => {
        const propValue = this.props.propValue;
        prefs[propValue] = !prefs[propValue];
        updateLocalstorage();
        return {};
      });
    };
    render(props, state) {
      const propValue = props.propValue;
      return h(
        "button",
        { class: "pref-button", onClick: this._togglePref },
        props.propString,
        " is ",
        prefs[propValue] ? "On" : "Off"
      );
    }
  }

  const App = function() {
    return h(
      "div",
      { class: "image-root" },
      h(
        "form",
        { action: "/images/search/" },
        h("input", {
          class: "paper-input",
          placeholder: "Search",
          name: "q",
          value: query || null
        }),
        h("button", { class: "sbm-btn" }, "Search")
      ),
      h(
        "div",
        { style: "display:flex" },
        h(PropertyComponent, {
          propValue: "saveData",
          propString: "Data Saver"
        }),
        h(PropertyComponent, {
          propValue: "slideShow",
          propString: "Slideshow"
        })
      ),
      query
        ? [
            h("div", null, "Search Results For: ", query),
            h(ImageViewer, { bingData, googleData })
          ]
        : h("div", null, "Enter your search above")
    );
  };
  render(h(App), root);
})();
