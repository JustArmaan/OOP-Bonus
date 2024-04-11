"use strict";

import { randomUUID } from "crypto";

export const schema = `
  type Post {
    id: ID!
    title: String!
    content: String!
    tags: [Tag!]!
  }

  type Tag {
    id: ID!
    name: String!
  }

  input PostCreate {
    title: String!
    content: String!
    tagIds: [ID!]!
  }

  type Query {
    getPosts: [Post!]!
    getPost(id: ID!): Post
    getTags: [Tag!]!
    getPostsByTag(tagId: ID!): [Post!]!
  }

  type Mutation {
    createPost(newPost: PostCreate!): Post!
    deletePost(id: ID!): Post
    updatePost(id: ID!, updatedPost: PostCreate!): Post
    createTag(name: String!): Tag!
  }
`;

export const resolvers = {
  Query: {
    getPosts: (_parent, args, { app }) => {
      return app.db.posts;
    },
    getPost: (_parent, args, { app }) => {
      const { id } = args;
      return app.db.posts.find((post) => post.id === id);
    },
    getTags: (_parent, args, { app }) => {
      return app.db.tags;
    },
    getPostsByTag: (_parent, args, { app }) => {
      const { tagId } = args;
      return app.db.posts.filter((post) => post.tags.find((tag) => tag.id === tagId));
    }
  },
  Mutation: {
    createPost: (_parent, { newPost }, { app }) => {
      const { title, content } = newPost;

      const post = {
        id: randomUUID(),
        title,
        content,
      };
      app.db.posts.push(post);
      return post;
    },
    deletePost: (_parent, { id }, { app }) => {
      const index = app.db.posts.findIndex((post) => post.id === id);
      if (index === -1) {
        throw new Error("Post not found");
      }
      const deletePost = app.db.posts.splice(index, 1);
      return deletePost;
    },
    updatePost: (_parent, { id, updatedPost }, { app }) => {
      const index = app.db.posts.findIndex((post) => post.id === id);
      if (index === -1) {
        throw new Error("Post not found");
      }
      const { title, content } = updatedPost;
      const updatePost = app.db.posts[index];
      updatePost.title = title;
      updatePost.content = content;
      return updatePost;
    },
    createTag: (_parent, { name }, { app }) => {
      const tag = {
        id: randomUUID(),
        name,
      };
      app.db.tags.push(tag);
      return tag;
    }
  },
};

export const loaders = {};
