
const questionheader = ({metadata}) => {
    console.log("Metadata in questionheader:", metadata);
  return (
    <div className="overflow-x-auto mb-6">
        <p className="text-sm font-bold text-center flex-grow">
    || Jai Sri Gurudev ||
  </p>
  <p className="text-sm font-bold text-center flex-grow">
    Sri AdichunchanagiriShikshana Trust(R)
  </p>
         <h1 className="text-2xl font-bold my-2">SJB Institute of Technology</h1>
         <p className="text-sm font-bold ">ESTD:2001</p>
         <div className="flex items-center justify-between">
  {/* Left Logo */}
  <img src="./sjb_logo.jpg" alt="Left Logo" className="h-20 w-auto" />

  {/* Center Text */}
  <p className="text-sm font-bold text-center flex-grow">
    (An Autonomous Institution affiliated to VTU, Belagavi)
  </p>
  

  {/* Right Logo */}
  <img src="./naac.png" alt="Right Logo" className="h-16 w-auto" />
</div>

<p className="text-sm font-bold text-center flex-grow">
    Approved by AICTE-New Delhi, Recogonized by UGC, Accredited by NAAC with 'A' Grade,
  </p>
  <p className="text-sm font-bold text-center flex-grow">
    Accrediated by National Board of Accreditation
  </p>

         <h1 className="text-2xl font-bold my-2">Department of Computer Science and Engineering</h1>
  <table className="w-full border border-gray-400 text-center">
    <tbody>
      {/* Row 1 */}
      <tr>
        <td className="border border-gray-400 px-4 py-2 font-semibold" colSpan={2}>
          Internal Assessment
        </td>
        <td className="border border-gray-400 px-4 py-2 font-semibold" colSpan={2}>
          Academic Year
        </td>
      </tr>

      {/* Row 2 */}
      <tr>
        <td className="border border-gray-400 px-4 py-2 font-semibold">Course Title: {metadata.subject}</td>
        <td className="border border-gray-400 px-4 py-2 font-semibold">Course Code</td>
        <td className="border border-gray-400 px-4 py-2 font-semibold">Semester & Section</td>
        <td className="border border-gray-400 px-4 py-2 font-semibold"></td>
      </tr>

      {/* Row 3 */}
      <tr>
        <td className="border border-gray-400 px-4 py-2 font-semibold">Date</td>
        <td className="border border-gray-400 px-4 py-2 font-semibold">Time</td>
        <td className="border border-gray-400 px-4 py-2 font-semibold">Duration</td>
        <td className="border border-gray-400 px-4 py-2 font-semibold"></td>
      </tr>

      {/* Row 4 */}
      <tr>
        <td className="border border-gray-400 px-4 py-2 font-semibold">Faculty In-Charge</td>
        <td className="border border-gray-400 px-4 py-2 font-semibold">Max Marks</td>
        <td className="border border-gray-400 px-4 py-2" colSpan={2}></td>
      </tr>
    </tbody>
  </table>
</div>
  );
}
export default questionheader;