import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonialsSection",
  title: "Testimonials Section",
  type: "document",
  groups: [
    { name: "content", title: "Content" },
    { name: "drone", title: "Drone Diaries" },
    { name: "videoTestimonials", title: "Video Testimonials" },
  ],
  fields: [
    // =========================================================================
    // MAIN CONTENT
    // =========================================================================
    defineField({
      name: "eyebrow",
      title: "Eyebrow Text",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: "title",
      title: "Main Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().max(100),
    }),

    // =========================================================================
    // DRONE DIARIES SECTION
    // =========================================================================
    defineField({
      name: "droneSection",
      title: "Drone Diaries Section",
      type: "object",
      group: "drone",
      fields: [
        {
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          validation: (Rule) => Rule.max(50),
        },
        {
          name: "title",
          type: "string",
          title: "Title",
          validation: (Rule) => Rule.required().max(100),
        },
        {
          name: "placeholderText",
          type: "string",
          title: "Placeholder Text",
          description: "Alt text for the facility image/video poster.",
        },
        {
          name: "videoUrl",
          type: "url",
          title: "Main Video URL",
          description: "URL to the primary facility drone video.",
        },
        {
          name: "image",
          type: "image",
          title: "Facility Image / Video Poster",
          description: "Displayed if no video, or as video poster.",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
          ],
        },
        {
          name: "videos",
          type: "array",
          title: "Video Slider",
          description: "Additional videos displayed in a slider.",
          of: [
            {
              type: "object",
              title: "Video",
              fields: [
                {
                  name: "title",
                  type: "string",
                  title: "Video Title",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "description",
                  type: "text",
                  title: "Description",
                  rows: 2,
                },
                {
                  name: "videoUrl",
                  type: "url",
                  title: "Video URL",
                },
                {
                  name: "thumbnail",
                  type: "image",
                  title: "Thumbnail",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alt Text",
                    },
                  ],
                },
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "description",
                  media: "thumbnail",
                },
              },
            },
          ],
        },
        {
          name: "highlights",
          type: "array",
          title: "Highlights / Stats",
          description: "Key facts about the facility.",
          of: [{ type: "string" }],
        },
        {
          name: "note",
          type: "string",
          title: "Footer Note",
          description: "Small text at the bottom (e.g., 'Virtual tour coming soon').",
        },
      ],
    }),
    defineField({
      name: "videoTestimonialsSection",
      title: "Client Video Testimonials",
      type: "object",
      group: "videoTestimonials",
      fields: [
        {
          name: "eyebrow",
          type: "string",
          title: "Eyebrow",
          validation: (Rule) => Rule.max(50),
        },
        {
          name: "title",
          type: "string",
          title: "Title",
          validation: (Rule) => Rule.required().max(100),
        },
        {
          name: "placeholderText",
          type: "string",
          title: "Placeholder Text",
          description: "Alt text for the video area.",
        },
        {
          name: "videos",
          type: "array",
          title: "Video Slider",
          description: "Testimonial videos.",
          of: [
            {
              type: "object",
              title: "Video",
              fields: [
                {
                  name: "title",
                  type: "string",
                  title: "Video Title",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "description",
                  type: "text",
                  title: "Description",
                  rows: 2,
                },
                {
                  name: "videoUrl",
                  type: "url",
                  title: "Video URL",
                },
                {
                  name: "thumbnail",
                  type: "image",
                  title: "Thumbnail",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alt Text",
                    },
                  ],
                },
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "description",
                  media: "thumbnail",
                },
              },
            },
          ],
        },
        {
          name: "highlights",
          type: "array",
          title: "Highlights / Stats",
          description: "Key stats or points.",
          of: [{ type: "string" }],
        },
        {
          name: "note",
          type: "string",
          title: "Footer Note",
          description: "Small text at the bottom.",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "eyebrow",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Testimonials Section",
        subtitle: subtitle || "No eyebrow",
      };
    },
  },
});
