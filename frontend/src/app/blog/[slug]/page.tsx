import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '../page';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: 'Post Not Found | Skinimage',
    };
  }
  return {
    title: `${post.title} | Skinimage`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-white min-h-screen pb-24">
      {/* Back Button and Category Header */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-emerald-800 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Journal
        </Link>

        {/* Category */}
        <div className="inline-block bg-emerald-50 text-emerald-800 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-emerald-800/10 mb-4">
          {post.category}
        </div>

        {/* Title */}
        <h1 className="font-serif text-3.5xl sm:text-5xl font-normal text-stone-900 tracking-tight leading-[115%] mb-6">
          {post.title}
        </h1>

        {/* Author / Date info */}
        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-stone-200/60 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-stone-400" />
            By {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-stone-400" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-stone-400" />
            {post.readTime}
          </span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 my-10">
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/40 shadow-sm">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div 
          className="prose prose-stone max-w-none text-stone-600 text-sm sm:text-base leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Signoff / Call to Action */}
        <div className="mt-16 pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h4 className="font-serif text-lg font-medium text-stone-900">Looking for custom skin guidance?</h4>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">Try our clinical skin analyzer to build your personalized regimen.</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/skin-analyzer"
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-md"
            >
              Analyze Skin
            </Link>
            <Link 
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold px-6 py-2.5 text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-md"
            >
              Shop Regimen
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
