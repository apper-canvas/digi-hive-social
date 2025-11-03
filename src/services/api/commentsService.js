import commentsData from "@/services/mockData/comments.json";

class CommentsService {
  constructor() {
    this.comments = [...commentsData];
  }

  async getByPostId(postId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const postComments = this.comments
          .filter(comment => comment.postId === postId && !comment.parentId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Build nested structure
        const buildReplies = (parentId) => {
          return this.comments
            .filter(comment => comment.parentId === parentId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map(comment => ({
              ...comment,
              replies: buildReplies(comment.id)
            }));
        };

        const commentsWithReplies = postComments.map(comment => ({
          ...comment,
          replies: buildReplies(comment.id)
        }));

        resolve(commentsWithReplies);
      }, Math.random() * 300 + 200);
    });
  }

  async getByUser(username) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userComments = this.comments
          .filter(comment => comment.authorUsername === username)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(comment => ({
            ...comment,
            postTitle: `Post ${comment.postId}` // Mock post title
          }));
        
        resolve([...userComments]);
      }, Math.random() * 300 + 200);
    });
  }

  async create(commentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComment = {
          id: `c${Math.max(...this.comments.map(c => parseInt(c.id.replace("c", "")))) + 1}`,
          postId: commentData.postId,
          parentId: commentData.parentId || null,
          content: commentData.content,
          authorUsername: "demo_user", // Simulated current user
          upvotes: 1, // Auto-upvote own comment
          downvotes: 0,
          createdAt: new Date().toISOString(),
          userVote: "up",
          isCollapsed: false,
          replies: []
        };

        this.comments.push(newComment);
        resolve({ ...newComment });
      }, Math.random() * 500 + 300);
    });
  }

  async vote(commentId, voteType) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const commentIndex = this.comments.findIndex(c => c.id === commentId);
        if (commentIndex === -1) {
          reject(new Error("Comment not found"));
          return;
        }

        const comment = this.comments[commentIndex];
        const previousVote = comment.userVote;

        // Remove previous vote
        if (previousVote === "up") {
          comment.upvotes -= 1;
        } else if (previousVote === "down") {
          comment.downvotes -= 1;
        }

        // Apply new vote (or toggle off if same)
        if (voteType === previousVote) {
          comment.userVote = "none";
        } else {
          comment.userVote = voteType;
          if (voteType === "up") {
            comment.upvotes += 1;
          } else if (voteType === "down") {
            comment.downvotes += 1;
          }
        }

        resolve({ success: true });
      }, Math.random() * 200 + 100);
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const commentIndex = this.comments.findIndex(c => c.id === id);
        if (commentIndex === -1) {
          reject(new Error("Comment not found"));
          return;
        }

        this.comments[commentIndex] = { ...this.comments[commentIndex], ...data };
        resolve({ ...this.comments[commentIndex] });
      }, Math.random() * 300 + 200);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const commentIndex = this.comments.findIndex(c => c.id === id);
        if (commentIndex === -1) {
          reject(new Error("Comment not found"));
          return;
        }

        // Also remove all replies
        const removeReplies = (parentId) => {
          const replies = this.comments.filter(c => c.parentId === parentId);
          replies.forEach(reply => {
            removeReplies(reply.id);
            const replyIndex = this.comments.findIndex(c => c.id === reply.id);
            if (replyIndex !== -1) {
              this.comments.splice(replyIndex, 1);
            }
          });
        };

        removeReplies(id);
        this.comments.splice(commentIndex, 1);
        resolve({ success: true });
      }, Math.random() * 300 + 200);
    });
  }
}

export const commentsService = new CommentsService();