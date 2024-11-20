"use client";
import React from 'react'
import {
    Dialog,
    DialogContent,
} from "@/src/_components/ui/dialog";
import dynamic from 'next/dynamic';
import { Skeleton } from '@/src/_components/ui/skeleton';

export default function MainDialog({
    title,
    isolate,
    setOpened,
    openDialog,
    setOpenDialog,
    mainComponent,
}: {
    title: string;
    isolate: boolean;
    openDialog: boolean,
    mainComponent: any;
    setOpened: (_opened: null | string) => void;
    setOpenDialog: (_openDialog: boolean) => void
}) {
    const MainComponent = dynamic(() => mainComponent, {
        ssr: false,
        loading: () => isolate ? <span/> : <MainComponentLoadinSkeleton/>,
    })
    return (
        <Dialog 
            open={openDialog} 
            onOpenChange={(open) => {
                setOpenDialog(open)
                setOpened(null)
            }}
            modal={false}
        >
            {isolate ? <MainComponent /> : (
                <DialogContent
                    title={title}
                    containerClassName="text-[#5F3F57] text-lg font-[700] h-full flex flex-col"
                    topImageClassName='z-10'
                    onInteractOutside={(e) => e.preventDefault()}
                    tabBarModal={true}
                >
                    <MainComponent />
                </DialogContent>
            )}
        </Dialog>
    )
}

const MainComponentLoadinSkeleton = () => {
    return (
        <div className='space-y-4 p-4 h-full  grid flex-1 bg-[#ae6e51] rounded-lg  w-full animate-pulse'>
            <div className='flex flex-col space-y-2 justify-between'>
                <Skeleton className="w-full h-8 bg-[#89454d] rounded animate-none" />
            </div>
            {[1, 2, 3, 4, 5].map((_, idx) => (
                <div key={idx} className='flex justify-between items-start p-4 border border-[#89454d] rounded-lg space-x-4'>
                    <div className='flex-1 space-y-2'>
                        <Skeleton className="w-2/3 h-4 bg-[#b55e44] rounded animate-none" />
                        <Skeleton className="w-1/3 h-4 bg-[#b55e44] rounded animate-none" />
                    </div>
                    <Skeleton className="w-20 h-6 bg-[#b55e44] rounded-full" />
                </div>
            ))}

            <Skeleton className="w-2/3 h-6 bg-[#b55e44] rounded animate-none" />
            <div className='flex space-x-4'>
                <Skeleton className="w-1/2 h-12 bg-[#b55e44] rounded-lg animate-none" />
                <Skeleton className="w-1/2 h-12 bg-[#b55e44] rounded-lg animate-none" />
            </div>
        </div>
    )
}