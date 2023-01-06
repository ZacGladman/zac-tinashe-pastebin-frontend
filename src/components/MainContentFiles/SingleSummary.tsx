import axios from "axios";
import { useState } from "react";
import { baseUrl } from "../../utils/envBaseURL";
import {
  InputComment,
  inputEvent,
  ISingleSummary,
} from "../../utils/interfaces";

export default function SingleSummary({
  paste,
  isActive,
  setActiveIndex,
  singleSummaryIndex,
  setSingleSummaryIndex,
  fetchedComments,
  fetchComments,
}: ISingleSummary): JSX.Element {
  const shortenedBody =
    paste.body.length > 640 ? paste.body.slice(0, 639) : undefined;
  const [inputComment, setInputComment] = useState<InputComment>({
    username: "",
    comment: "",
  });

  const handleCommentChange = (e: inputEvent) => {
    setInputComment(() => {
      return { ...inputComment, [e.target.name]: e.target.value };
    });
  };
  const handleSubmitComment = async () => {
    await axios.post(baseUrl + `/pastes/${paste.id}/comments`, inputComment);
    fetchComments();
  };

  return (
    <>
      <div
        className={isActive ? "fullView" : "defaultView"}
        onClick={() => setSingleSummaryIndex(paste.id)}
      >
        {singleSummaryIndex && (
          <button
            onClick={(e) => {
              setSingleSummaryIndex(undefined);
              e.stopPropagation();
            }}
          >
            return to pastes summary
          </button>
        )}
        <h3 className="pasteTitle">{paste.title}</h3>
        <div className="pasteBody">
          {isActive ? (
            <p>
              {paste.body}
              <button
                onClick={(e) => {
                  setActiveIndex(undefined);
                  e.stopPropagation();
                }}
              >
                show less
              </button>
            </p>
          ) : (
            <p>
              {shortenedBody ?? paste.body}
              {shortenedBody && (
                <button
                  onClick={(e) => {
                    setActiveIndex(paste.id);
                    e.stopPropagation();
                  }}
                >
                  [...]
                </button>
              )}
            </p>
          )}
        </div>
      </div>
      {singleSummaryIndex && (
        <div className="commentSection">
          <h4>comments</h4>
          <form
            onSubmit={(e) => {
              handleSubmitComment();
              e.preventDefault();
            }}
          >
            <input
              type="text"
              placeholder="username"
              required
              value={inputComment.username}
              name="username"
              onChange={(e) => handleCommentChange(e)}
            />
            <input
              type="text"
              placeholder="add comment"
              required
              value={inputComment.comment}
              name="comment"
              onChange={(e) => handleCommentChange(e)}
            />
            <input type="submit" />
          </form>
          <ul className="commentsList">
            {fetchedComments &&
              fetchedComments.map((comment) => {
                return (
                  <li key={comment.comment_id}>
                    {comment.username}: {comment.comment}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </>
  );
}
