'use client'

import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from '@/components/ui/card'


const Home = () => {
  return (
    <main className=
    "flex min-h-screen flex-col items-center justify-between p-24">

      <h1 className="
      text-6xl font-bold">Dive into the world of Mystery Message - An Anonymous Convesations</h1>
      <p className="text-2xl">A place where you can share your thoughts and feelings 
      anonymously with your friends and family.</p>
      <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full max-w-xs">
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

    </main>
    

  )
}

export default Home