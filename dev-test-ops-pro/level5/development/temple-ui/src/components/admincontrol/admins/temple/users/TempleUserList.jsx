import React, { useEffect, useState, useRef } from "react";
import { Transfer, Spin } from "antd";
import { fetchCustomTempleUsers } from "../../../../../services/temple";
import FilterBar from "./FilterBar";

const PAGE_SIZE = 10;

const TempleUserTransfer = ({ id }) => {
  const [users, setUsers] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});
  const transferRef = useRef(null);

  const loadUsers = async () => {
    try {
      const { users: fetchedUsers } = await fetchCustomTempleUsers({
        id,
        page,
        pageSize: PAGE_SIZE,
        ...filters,
      });

      const formatted = fetchedUsers.map(user => ({
        key: user.id.toString(),
        title: user.username,
        description: user.email,
      }));

      setUsers(prev => [...prev, ...formatted]);

      if (fetchedUsers.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error fetching temple users:", err);
    }
  };

  // Initial Load or on filter change
  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, filters]);

  // Custom scroll handler
  const handleScroll = e => {
    const bottom =
      e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 5;
    if (bottom && hasMore) {
      loadUsers();
    }
  };

  return (
    <>
      <FilterBar
        onFilter={newFilters => {
          setFilters(newFilters);
        }}
      />

      <Transfer
        dataSource={users}
        targetKeys={targetKeys}
        onChange={setTargetKeys}
        titles={["Available Users", "Assigned Users"]}
        showSearch
        render={item => `${item.title} - ${item.description}`}
        listStyle={{
          width: 300,
          height: 400,
          overflow: "auto",
        }}
        // Add scroll listener
        children={({ direction, filteredItems }) => {
          return (
            <div
              style={{ overflow: "auto", height: 400 }}
              onScroll={handleScroll}
              ref={transferRef}
            >
              {filteredItems.map(item => (
                <div key={item.key}>{item.title}</div>
              ))}
              {hasMore && <Spin style={{ margin: "8px auto", display: "block" }} />}
            </div>
          );
        }}
      />
    </>
  );
};

export default TempleUserTransfer;
