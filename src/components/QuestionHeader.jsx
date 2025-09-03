
const questionheader = ({metadata}) => {
    // console.log("Metadata in questionheader:", metadata);
  return (
    <div className="overflow-x-auto mb-6 font-serif">
    <div className="flex items-center justify-between">
        <img src="./sjb_logo.jpg" alt="Left Logo" className="h-20 w-auto" />

        <div className="flex-grow text-center">
            <p className="text-xs font-bold font-serif">
                || Jai Sri Gurudev ||
            </p>
            <p className="text-xs font-bold font-serif">
                Sri AdichunchanagiriShikshana Trust <sup>&reg;</sup>
            </p>
            <h1 className="text-l font-bold tracking-wider font-serif">SJB Institute of Technology</h1>
            <p className="text-xs font-bold">
                (An Autonomous Institution affiliated to VTU, Belagavi)
            </p>
            <p className="text-xs font-bold">
                Approved by AICTE-New Delhi, Recognized by UGC, Accredited by NAAC with 'A' Grade,
            </p>
            <p className="text-xs font-bold">
                Accredited by National Board of Accreditation
            </p>
            <h1 className="text-l font-bold my-2">Department of Computer Science and Engineering</h1>
        </div>

        <img src="./naac.png" alt="Right Logo" className="h-16 w-auto" />
    </div>
    <hr className="border-2 border-black"/>
</div>

  );
}
export default questionheader;