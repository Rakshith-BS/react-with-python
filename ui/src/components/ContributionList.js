import React, { useEffect, useState } from "react";
import ContributionCard from "./ContributionCard";

const ContributionList = () => {
  const [contributions, setContributions] = useState([]);
  const [filteredContributions, setFilteredContributions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const contributionsPerPage = 14;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/contributions/");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setContributions(data.contributions);
        setFilteredContributions(data.contributions);
      } catch (error) {
        console.error("There was an error fetching the contributions:", error);
        setContributions([]);
        setFilteredContributions([]);
      }
    };
    fetchData();
  }, []);

  // Handle Search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    setFilteredContributions(
      contributions.filter((contribution) =>
        contribution.title.toLowerCase().includes(value)
      )
    );
    setCurrentPage(1);
  };
  // Pagination Logic
  const indexOfLastContribution = currentPage * contributionsPerPage;
  const indexOfFirstContribution =
    indexOfLastContribution - contributionsPerPage;
  const currentContributions = filteredContributions.slice(
    indexOfFirstContribution,
    indexOfLastContribution
  );

  const handleNextPage = () => {
    if (
      currentPage <
      Math.ceil(filteredContributions.length / contributionsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleStatusFilter = (event) => {
    const value = event.target.value;
    setStatusFilter(value);
    filterContributions(searchTerm, value);
  };

  const filterContributions = (search, status) => {
    let filtered = contributions.filter((contribution) =>
      contribution.title.toLowerCase().includes(search)
    );

    if (status !== "All") {
      filtered = filtered.filter((contribution) => {
        const currentTime = new Date();
        const startTime = new Date(contribution.startTime);
        const endTime = new Date(contribution.endTime);
        let contributionStatus;

        if (currentTime < startTime) {
          contributionStatus = "Scheduled";
        } else if (currentTime >= startTime && currentTime <= endTime) {
          contributionStatus = "Active";
        } else {
          contributionStatus = "Complete";
        }

        return contributionStatus === status;
      });
    }

    setFilteredContributions(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="contribution-list">
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="status-filter"
        >
          <option value="All">All</option>
          <option value="Complete">Complete</option>
          <option value="Active">Active</option>
          <option value="Scheduled">Scheduled</option>
        </select>
      </div>

      <div className="contributions-grid">
        {currentContributions.length > 0 ? (
          currentContributions.map((contribution) => (
            <ContributionCard
              key={contribution.id}
              contribution={contribution}
            />
          ))
        ) : (
          <p className="no-results">Oops! Nothing found.</p>
        )}
      </div>
      {filteredContributions.length > 0 && (
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={
              currentPage ===
              Math.ceil(filteredContributions.length / contributionsPerPage)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ContributionList;
