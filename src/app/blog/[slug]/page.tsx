import type { Metadata } from "next"
import { BLOG_POSTS, getPostBySlug } from "@/lib/data/blog"
import BlogPostPage from "@/components/pages/BlogPostPage"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  return {
    title: post ? `${post.title} — FashionHub Style Notes` : "Style Notes — FashionHub",
    description: post?.excerpt ?? "Fashion tips, seasonal guides and style stories from FashionHub.",
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <BlogPostPage slug={slug} />
}
