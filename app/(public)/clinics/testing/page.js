'use client';
// import {ClinicCard} from '@/components/ui/ClinicCard';
import Card from '@/components/ui/GeneralCard';
import SidebarWrapper from '@/components/dashboard/SidebarWrapper';
import CardTest from '@/components/testing/CardTest';
import {useState, useEffect}  from 'react';
import { Pencil, Calendar, MessageCircle, User, Home } from "lucide-react";

export default function Testing(){
  const [mode,setMode] = useState('Dashboard');
  const buttons = [
    { label: "Dashboard", icon: <Home size={20} /> },
    { label: "Edit", icon: <Pencil size={20}/> },
    { label: "Doctors", icon: <User size={20}/> },
    { label: "Booking", icon: <Calendar size={20}/> },
    { label: "Inquiries", icon: <MessageCircle size={20}/> }
  ];
  return(
    <>
    {/* <ClinicCard />; */}
    {/* <Card className="m-10 w-[50vw]" style={{border:"1px solid black"}}>
      <p>Testing</p>
    </Card>; */}
    {/* <div className="grid grid-cols-3 gap-4 mx-10">
    <CardTest title="Jade Kyll" description="BSCS Student 3rd year" className="my-10"></CardTest>
    <CardTest title="Joseph Christian" description="BSCS Student 3rd year" className="my-10"></CardTest>
    <CardTest title="Nova Grace" description="BSCS Student 3rd year" className="my-10"></CardTest>
    </div> */}

    <div className="flex">

    <SidebarWrapper mode={mode} setMode={setMode} buttons={buttons}>
    </SidebarWrapper>
    <div className="flex-1 p-4">
    </div>

    </div>
  
    </>
   )
}