// import {ClinicCard} from '@/components/ui/ClinicCard';
import Card from '@/components/ui/GeneralCard';
import CardTest from '@/components/testing/CardTest';

export default function Testing(){
  return(
    <>
    {/* <ClinicCard />; */}
    {/* <Card className="m-10 w-[50vw]" style={{border:"1px solid black"}}>
      <p>Testing</p>
    </Card>; */}
    <div className="grid grid-cols-3 gap-4 mx-10">
    <CardTest title="Jade Kyll" description="BSCS Student 3rd year" className="my-10"></CardTest>
    <CardTest title="Joseph Christian" description="BSCS Student 3rd year" className="my-10"></CardTest>
    <CardTest title="Nova Grace" description="BSCS Student 3rd year" className="my-10"></CardTest>
    </div>

    </>
   )
}