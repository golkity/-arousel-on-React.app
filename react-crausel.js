const slideData = [
  {
    index: 0,
    headline_n:"Дмитрий Мозжухин\n",
    headline_h:"вокал, гитара",
    src: "img/soustav/dmitri.jpeg",
  },

  {
    index: 1,
    headline_n:"Максим Кульша",
    headline_h:"гитара",
    src: "img/soustav/z.jpg",
  },
  {
    index: 2,
    headline_n:"Александр Тимофеев",
    headline_h:"саксофон",
    src: "img/soustav/alex.jpeg",
  },
  {
    index:3,
    headline_n:"Илья Герасименко",
    headline_h:"ударные",
    src: "img/soustav/ilia.jpeg",
  },
  {
    index:4,
    headline_n:"Антон Макаров",
    headline_h:"клавиши",
    src:"img/soustav/makr.jpeg",
  },
  {
    index:5,
    headline_n:"Сергей Акимов",
    headline_h:"бас-гитара",
    src:"img/soustav/t.jpg",
  }
];

class Slide extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleSlideClick = this.handleSlideClick.bind(this);
    this.imageLoaded = this.imageLoaded.bind(this);
    this.slide = React.createRef();
  }

  handleMouseMove(event) {
    const el = this.slide.current;
    const r = el.getBoundingClientRect();

    el.style.setProperty(
      "--x",
      event.clientX - (r.left + Math.floor(r.width / 2))
    );
    el.style.setProperty(
      "--y",
      event.clientY - (r.top + Math.floor(r.height / 2))
    );
  }

  handleMouseLeave(event) {
    this.slide.current.style.setProperty("--x", 0);
    this.slide.current.style.setProperty("--y", 0);
  }

  handleSlideClick(event) {
    this.props.handleSlideClick(this.props.slide.index);
  }

  imageLoaded(event) {
    event.target.style.opacity = 1;
  }

  render() {
    const { src, headline_h,headline_n, index } = this.props.slide;
    const current = this.props.current;
    let classNames = "slide";

    if (current === index) classNames += " slide--current";
    else if (current - 1 === index) classNames += " slide--previous";
    else if (current + 1 === index) classNames += " slide--next";

    return React.createElement(
      "li",
      {
        ref: this.slide,
        className: classNames,
        onClick: this.handleSlideClick,
        onMouseMove: this.handleMouseMove,
        onMouseLeave: this.handleMouseLeave,
      },

      React.createElement(
        "div",
        { className: "slide__image-wrapper" },
        React.createElement("img", {
          className: "slide__image",
          alt: headline_n,
          src: src,
          onLoad: this.imageLoaded,
        })
      ),
      React.createElement(
        "article",
        { className: "slide__content" },
        React.createElement("h2", { className: "slide__headline_n" }, headline_n),
        React.createElement("h2",{className:"slide_headline_h"},headline_h),
      )
    );
  }
}

const SliderControl = ({ type, title, handleClick }) => {
  return React.createElement(
    "button",
    {
      className: `btn btn--${type}`,
      title: title,
      onClick: handleClick,
    },
    React.createElement(
      "svg",
      { className: "icon", viewBox: "0 0 24 24" },
      React.createElement("path", {
        d: "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",
      })
    )
  );
};

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = { current: 0 };
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleSlideClick = this.handleSlideClick.bind(this);
  }

  handlePreviousClick() {
    const previous = this.state.current - 1;

    this.setState({
      current: previous < 0 ? this.props.slides.length - 1 : previous,
    });
  }

  handleNextClick() {
    const next = this.state.current + 1;

    this.setState({
      current: next === this.props.slides.length ? 0 : next,
    });
  }

  handleSlideClick(index) {
    if (this.state.current !== index) {
      this.setState({
        current: index,
      });
    }
  }

  render() {
    const { current, direction } = this.state;
    const { slides, heading } = this.props;
    const headingId = `slider-heading__${heading
      .replace(/\s+/g, "-")
      .toLowerCase()}`;
    const wrapperTransform = {
      transform: `translateX(-${current * (100 / slides.length)}%)`,
    };

    return React.createElement(
      "div",
      { className: "slider", "aria-labelledby": headingId },
      React.createElement(
        "ul",
        { className: "slider__wrapper", style: wrapperTransform },
        React.createElement(
          "h3",
          { id: headingId, class: "visuallyhidden" },
          heading
        ),

        slides.map((slide) => {
          return React.createElement(Slide, {
            key: slide.index,
            slide: slide,
            current: current,
            handleSlideClick: this.handleSlideClick,
          });
        })
      ),

      React.createElement(
        "div",
        { className: "slider__controls" },
        React.createElement(SliderControl, {
          type: "previous",
          title: "назад",
          handleClick: this.handlePreviousClick,
        }),

        React.createElement(SliderControl, {
          type: "next",
          title: "вперед",
          handleClick: this.handleNextClick,
        })
      )
    );
  }
}

ReactDOM.render(
  React.createElement(Slider, {
    heading: "Example Slider",
    slides: slideData,
  }),
  document.getElementById("app")
);
