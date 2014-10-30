/** @jsx React.DOM */

// This is the main component in the mini-site. It has a number of methods that handle
// updating it's state data and even changing the state of the app.  You'll notice that the
// render method is similar to angularJS directive templates. React makes it easy to nest components
// within each other and trickle down data directly between them through tag properties.
// The biggest conceptual takeaway from this style is that data is NOT two-way binded...
// It is fed into one component and is filtered down to the smaller ones. That means that the whole
// state of a large component must be fed in for each update.  Due to the virtual DOM optimization(?)
// this actually happens very fast for the user.  The only DOM elements that actually end up getting
// re-rendered upon state refresh are the ones that have changed from their previous state.

var CommentBox = React.createClass({

  /*
    Invoked once before the component is mounted. The return value will be used as 
    the initial value of this.state.
  */
  getInitialState: function() {
    return { data : [] };                
  },

  // method to populate update the 'state' of this React component via a jquery ajax request 
  // to the location indicated in the 'props' property of the component.
  // note the this.setState() method ---
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: "json",
      success: function (data) {
        this.setState({ data : data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  // method that handles a new comment. the data for the state of this app is just one
  // array of comment objects... this method concats the new comment to that array, sets
  // its state to the new array, and sends the comment via a jquery post to the server to handle.
  handleCommentSubmit: function (comment) {
    // this.state!
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({ data : newComments }); //set the state of the component!
    $.ajax({
      // this.props.url is the value passed into the 'url' property of the component!
      url: this.props.url,
      dataType: "json",
      type: "POST",
      data: comment,
      success: function (data) {
        this.setState({ data : data });
      }.bind(this), // i don't know what the .bind(this) does...
      error: function (xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  // method that tells the server to delete all comments.
  // it shows a dumb nuke gif for 5 seconds while hiding the comment box
  // very hackily via jquery.
  handleNuke: function () {
    // show gif for 5 seconds
    $("#content").hide();
    $("#gif").show();
    setTimeout(function(){
      $("#content").show();
      $("#gif").hide();
    }, 5000)

    // send ajax DELETE request to server
    $.ajax({
      url: this.props.url,
      dataType: "json",
      type: "DELETE",
      success: function () {
        this.setState({ data : [] });
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },


  /* 
    Invoked once, only on the client (not on the server), immediately after the initial rendering 
    occurs. At this point in the lifecycle, the component has a DOM representation which you can 
    access via this.getDOMNode().  If you want to integrate with other JavaScript frameworks, 
    set timers using setTimeout or setInterval, or send AJAX requests, perform those operations 
    in this method. 
  */
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  // This is the main function of the React.js library. It does crazy stuff behind the scenes
  // to optimize DOM rendering based upon the hierarchy of components determined by their render
  // functions. Furthermore, it is in this function that the data flow is determined via properties 
  // on nested components (see CommentList and CommentForm).

  /*
    The render() function should be pure, meaning that it does not modify component state, 
    it returns the same result each time it's invoked, and it does not read from or write 
    to the DOM or otherwise interact with the browser (e.g., by using setTimeout). If you 
    need to interact with the browser, perform your work in componentDidMount() or the other 
    lifecycle methods instead. Keeping render() pure makes server rendering more practical 
    and makes components easier to think about.
  */
  render: function() {
    return (
      <div style={commentBoxStyle} className="commentBox">
        <h1 style={headlineStyle}>COMMENTS</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <Nuke onNukeSubmit={this.handleNuke} />
      </div>
    );
  }
});

// Next component! A list of comments!
var CommentList = React.createClass({
  render: function() {
    // ng-repeat anyone?
    // also, note the curly braces for variable evaluation
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    // these return values are weird jsx syntax. i don't perfectly understand 
    // how this would look in vanilla js. the concept of it is simple enough though.
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  // As you'll see in the render function, this method is called upon onSubmit;
  handleSubmit: function(event) {
    // first, preventDefault
    event.preventDefault();

    // then grab the values from the (virtual?) dom via getDOMNode() based upon refs
    // set up in the render function...
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    // then call the function presumably passed in via the property onCommentSubmit with
    // an object containing author and text;
    this.props.onCommentSubmit({ author: author, text: text });

    // grab the values back to empty
    this.refs.author.getDOMNode().value = "";
    this.refs.text.getDOMNode().value= "";
    return;
  },

  // Notice that style is passed in inline... There must be a better way to do this.
  // The onSubmit property points to the handleSubmit method of the component.
  render: function() {
    return (
      <form style={submitCommentStyle} className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input style={postStyle} type="submit" value="Post" />
      </form>
    );
  }
});


// The comment is one of the simplest components.
// The render function just expects that the component be passed a property "author"
// and the "children" is whatever is nested within the component.
var Comment = React.createClass({
  render: function() {
    return (
      <div style={commentStyle} className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});


// The final class --- the only one i wrote myself.
// Very simple. It has one method "nuke" which is called onSubmit.
// nuke in turn calls whatever was passed into the property "onNukeSubmit"
var Nuke = React.createClass({
  nuke: function () {
    event.preventDefault();

    this.props.onNukeSubmit();
    return;
  },
  render: function() {
    return (            
      <form className="nuke" onSubmit={this.nuke}>
        <input style={nukeStyle} type="submit" value="NUKE COMMENTS" />
      </form>
    );
  }
});

// Main Function of the application.  THIS IS THE TOP LEVEL!
React.renderComponent(
    <CommentBox url="comments.json" pollInterval={5000} />,
    document.getElementById('content')

);

// React styles defined
var commentBoxStyle = {
  fontFamily: "Courier",
  color: "black",
  backgroundColor: "rgba(255,255,255,.5)",
  borderRadius: "5px",
  marginTop: "50px",
  marginBottom: "50px",
  display: "inline-block",
}

var nukeStyle = {
  backgroundColor: "yellow",
  borderRadius: "3px",
  border: "3px dashed black",
}

var commentStyle = {
  textAlign: "left",
  borderTop: "2px solid red",
  borderBottom: "2px solid blue",
  borderLeft: "2px solid blue",
  borderRight: "2px solid red",
  backgroundColor: "white",
  padding: "15px",
  paddingTop: "0px"
}

var submitCommentStyle = {
  padding: "15px"
}

var postStyle = {
  color: "black",
  backgroundColor: "pink",
  borderRadius: "3px",
  border: "3px solid black",
}

var headlineStyle = {
  textShadow: "2px 2px 2px pink",
  fontFamily: "Helvetica"
}
