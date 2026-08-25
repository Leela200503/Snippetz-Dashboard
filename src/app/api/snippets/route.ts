import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snippets = await prisma.snippet.findMany({
      where: {
        // @ts-ignore
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(snippets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    // @ts-ignore
    const userPlan = session.user.plan;

    // Limit check for free users
    if (userPlan === "FREE") {
      const snippetCount = await prisma.snippet.count({
        where: { userId }
      });
      if (snippetCount >= 3) {
        return NextResponse.json({ error: "Upgrade to Pro to create more snippets." }, { status: 403 });
      }
    }

    const { title, content, tags } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const snippet = await prisma.snippet.create({
      data: {
        title,
        content,
        tags,
        userId,
      },
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
