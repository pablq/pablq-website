var CommentBox = React.createClass({
  render: function() {
            return (
              <div className="commentBox">
                <h1>Comments</h1>
                <CommentList />
                <CommentForm />
              </div>
            );
          }
});

var CommentList = React.createClass({
  render: function() {
            return (
              <div className="commentList">
                I am a CommentList.
              </div>
            );
          }
});

var CommentForm = React.createClass({
  render: function() {
            return (
              <div className="commentForm">
                I am a CommentForm.
              </div>
            );
          }
});

React.renderComponent(
    <CommentBox />,
    document.getElementById('content')
);
