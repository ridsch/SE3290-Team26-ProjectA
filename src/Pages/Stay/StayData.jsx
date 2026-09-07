import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { DeleteHotel, fetchingHotels } from "../../Redux/StayReducer/action";
import "./StayData.css";
import PriceFilter from "./PriceFilter";
import Sidebar from "./Sidebar";
import Pagination from "./Pagination";

const StayData = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { data } = useSelector((store) => store.StayReducer);
  const checkInDate = useSelector((state) => state.StayReducer.checkInDate);
  const checkOutDate = useSelector((state) => state.StayReducer.checkOutDate);
  const selectedCity = useSelector((state) => state.StayReducer.selectedCity);

  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 10000]);
  const [filteredHotel, setFilteredHotel] = useState([]);
  const [price, setPrice] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalNumOfPages = Math.ceil(244 / 20);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const sort = searchParams.get("_sort") || "";
    const order = searchParams.get("_order") || "";
    dispatch(fetchingHotels(sort, order, pageNumber));
  };

  const handleLeft = (id) => {
    dispatch(DeleteHotel(id));
  };

  useEffect(() => {
    if (Array.isArray(data)) {
      let result = [...data];

      // Read price filter bounds from URL or fallback state
      const urlMin = Number(searchParams.get("minPrice"));
      const urlMax = Number(searchParams.get("maxPrice"));
      const minP = !isNaN(urlMin) && urlMin > 0 ? urlMin : Number(selectedPriceRange[0]) || 0;
      const maxP = !isNaN(urlMax) && urlMax > 0 ? urlMax : (Number(selectedPriceRange[1]) <= 250 ? Infinity : Number(selectedPriceRange[1]));

      result = result.filter((hotel) => {
        const hotelPrice = Number(hotel.price) || 0;
        return hotelPrice >= minP && hotelPrice <= maxP;
      });

      // Sort client-side to normalize empty strings, numbers, and ratings
      const sortParam = searchParams.get("_sort");
      const orderParam = searchParams.get("_order");

      if (sortParam?.includes("rating") || orderParam === "rating") {
        const isDesc = sortParam?.startsWith("-") || orderParam === "desc";
        result.sort((a, b) => {
          const rA = parseFloat(a.rating) || 1;
          const rB = parseFloat(b.rating) || 1;
          return isDesc ? rB - rA : rA - rB;
        });
      } else if (sortParam?.includes("price") || orderParam === "price") {
        const isDesc = sortParam?.startsWith("-") || orderParam === "desc";
        result.sort((a, b) => {
          const pA = Number(a.price) || 0;
          const pB = Number(b.price) || 0;
          return isDesc ? pB - pA : pA - pB;
        });
      }

      setFilteredHotel(result);
    }
  }, [data, selectedPriceRange, searchParams]);

  return (
    <div className="stay-data">
      <div className="sidebar-container">
        <Sidebar />
      </div>

      <div className="stay-cards-container">
        {filteredHotel?.map((hotel) => (
          <div className="stay-card" key={hotel.id}>
            <img src={hotel.image || hotel.img4} alt={hotel.name} />

            <div className="stay-info">
              <div className="stay-header">
                <h3 className="stay-name">{hotel.name}</h3>
                <button
                  className="stay-left-btn"
                  onClick={() => handleLeft(hotel.id)}
                >
                  We have 5 left
                </button>
              </div>
              <p className="stay-location">{hotel.location}</p>
              <p className="stay-description">{hotel.description}</p>
              <div className="stay-details">
                <div className="stay-price">
                  <span>Price:</span>
                  <p>₹{Number(hotel.price).toLocaleString()}</p>
                </div>
                <div className="stay-rating">
                  <span>Rating:</span>
                  <p>{hotel.rating ? hotel.rating : 1}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={totalNumOfPages}
        />
      </div>
    </div>
  );
};

export default StayData;