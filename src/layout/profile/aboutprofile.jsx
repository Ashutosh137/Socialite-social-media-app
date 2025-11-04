import { Popupitem } from "../../ui/popup";
import { MdDateRange as DateRangeIcon } from "react-icons/md";
import PropTypes from "prop-types";
import { useUserdatacontext } from "../../service/context/usercontext";

function Aboutprofile({ profiledata, close }) {
  const { defaultprofileimage } = useUserdatacontext();

  return (
    <Popupitem closefunction={close}>
      <section className="post sm:m-auto sm:w-96 w-full ">
        <h1 className="text-2xl font-sans text-center w-full capitalize">
          about this profile
        </h1>
        <div className="m-2 w-full text-center text-base capitalize flex justify-center flex-col space-y-4 my-12">
          <img
            className="rounded-full hover:scale-125 transition-all ease-in-out duration-300 m-auto w-20 h-20 "
            src={profiledata.profileImageURL || defaultprofileimage}
            onError={(e) => {
              e.target.src = defaultprofileimage;
            }}
          />
          <h1 className="text-xl">{profiledata?.name}</h1>
          <h1 className="text-gray-300 text-sm  border-b-2 w-40 m-auto border-black pb-1 rounded-full hover:border-gray-400">
            @ {profiledata?.username}
          </h1>
        </div>
        <div className="flex text-base capitalize justify-between">
          <i className="mr-auto my-auto ml-5 ">
            <DateRangeIcon />
          </i>
          <div className="w-64 sm:w-80">
            <h1>date joined :</h1>
            <h1 className="text-gray-300">
              {profiledata?.createdAt.toDate().toString()}
            </h1>
          </div>
        </div>
        <div className="w-full  flex justify-center my-10">
          <button
            onClick={close}
            className="px-10  capitalize rounded-full hover:bg-gray-800  bg-gray-700 text-lg p-2 text-white"
          >
            close
          </button>
        </div>
      </section>
    </Popupitem>
  );
}
Aboutprofile.propTypes = {
  profiledata: PropTypes.any,
  close: PropTypes.func.isRequired,
};
export default Aboutprofile;
