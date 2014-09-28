/** @jsx React.DOM */
$("#gif").hide();

// various React components.  All of them exist within the CommentBox
var CommentBox = React.createClass({
  getInitialState: function() {
    return { data : [] };                
  },
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
  handleCommentSubmit: function (comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({ data : newComments });
    $.ajax({
      url: this.props.url,
      dataType: "json",
      type: "POST",
      data: comment,
      success: function (data) {
        this.setState({ data : data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleNuke: function () {
    // show gif
    $("#content").hide();
    $("#gif").show();

    setTimeout(function(){
      $("#content").show();
      $("#gif").hide();
    }, 5000)
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
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
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

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({ author: author, text: text });
    this.refs.author.getDOMNode().value = "";
    this.refs.text.getDOMNode().value= "";
    return;
  },
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

// Main Function of the application.  This is the top level of the cascading rendering tree.
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
