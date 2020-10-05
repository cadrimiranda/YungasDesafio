import React, { ReactNode, useEffect, useState } from "react";
import "./App.scss";
import api, { pessoa } from "./mock/api/api";

import MenuItem from "@material-ui/core/MenuItem";
import { SearchOutlined } from "@ant-design/icons";

import { Input, Select, Radio, Button, Table as AntdTable, Space } from "antd";
import { RadioChangeEvent } from "antd/lib/radio";
import Preview from "./Preview";

function App() {
  const defaultGender = "all";
  const [itemPreview, setItemPreview] = useState<pessoa | null>(null);
  const [filters, setFilters] = useState({
    page: 0,
    rowsPerPage: 20,
    orderBy: "",
    nome: "",
    titulo: "",
    genero: defaultGender === "all" ? "" : defaultGender,
    cidade: "",
    logradouro: "",
    regiao: "",
  });
  const [data, setData] = useState<{ data: pessoa[]; total: number }>({
    data: [],
    total: 0,
  });

  useEffect(() => {
    const result = api.getAll(filters);
    setData(result);
  }, []);

  const handleSearch = ({
    titulo,
    cidade,
    genero,
    logradouro,
    nome,
    regiao,
  }: {
    titulo?: string;
    cidade?: string;
    genero?: string;
    logradouro?: string;
    nome?: string;
    regiao?: string;
  } = {}): void => {
    const novosFiltros = {
      ...filters,
      cidade: cidade || "",
      genero: genero || "",
      logradouro: logradouro || "",
      nome: nome || "",
      regiao: regiao || "",
      titulo: titulo || "",
    };

    setFilters(novosFiltros);
    const result = api.getAll(novosFiltros);
    setData(result);
  };

  const getInput = ({
    key,
    setSelectedKeys,
    selectedKeys,
    confirm,
  }: {
    key: string;
    setSelectedKeys: Function;
    selectedKeys: string;
    confirm: Function;
  }) => {
    if (key === "regiao") {
      return (
        <Select
          onChange={(value) => setSelectedKeys(value)}
          onClear={() => setSelectedKeys("")}
          allowClear
          placeholder="Região"
          size="middle"
          style={{ width: 188, marginBottom: 8, display: "block" }}
        >
          <MenuItem value="norte">Norte</MenuItem>
          <MenuItem value="nordeste">Nordeste</MenuItem>
          <MenuItem value="centroOeste">Centro-Oeste</MenuItem>
          <MenuItem value="sudeste">Sudeste</MenuItem>
          <MenuItem value="sul">Sul</MenuItem>
        </Select>
      );
    }

    if (key === "genero") {
      return (
        <Radio.Group
          size="middle"
          aria-label="gender"
          name="gender"
          value={selectedKeys}
          onChange={(e: RadioChangeEvent) => setSelectedKeys(e.target.value)}
          style={{
            width: 188,
            marginBottom: 8,
            display: "block",
            flexDirection: "row",
          }}
        >
          <Radio.Button value="female">Female</Radio.Button>
          <Radio.Button value="male">Male</Radio.Button>
        </Radio.Group>
      );
    }

    return (
      <Input
        placeholder={`Search ${key}`}
        value={selectedKeys}
        onChange={(e) => setSelectedKeys(e.target.value ? e.target.value : "")}
        onPressEnter={() => {
          confirm();
          handleSearch({ ...filters, [key]: selectedKeys });
        }}
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
    );
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        {getInput({
          key: dataIndex,
          setSelectedKeys,
          selectedKeys,
          confirm,
        })}
        <Space>
          <Button
            type="primary"
            onClick={() => {
              confirm();
              handleSearch({ ...filters, [dataIndex]: selectedKeys });
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              handleSearch({ ...filters, [dataIndex]: "" });
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
  });

  const handlePaginationChange = (page: number, rowsPerPage: number): void => {
    const novosFiltros = {
      ...filters,
      page,
      rowsPerPage,
    };

    setFilters(novosFiltros);
    const result = api.getAll(novosFiltros);
    setData(result);
  };

  const handleClickRow = (data: pessoa) => () => {
    setItemPreview(data);
  };

  return (
    <>
      <Preview
        data={itemPreview}
        visible={itemPreview !== null}
        onClose={handleClickRow(null)}
      />
      <AntdTable
        onRow={(item: pessoa) => ({
          onClick: handleClickRow(item),
          onTouchStart: handleClickRow(item),
        })}
        size="small"
        dataSource={data.data}
        scroll={{ y: 500 }}
        columns={[
          {
            title: "Titulo",
            dataIndex: ["name", "title"],
            ...getColumnSearchProps("titulo"),
          },
          {
            title: "Nome",
            dataIndex: ["name", "first"],
            ...getColumnSearchProps("nome"),
          },
          {
            title: "Genero",
            dataIndex: "gender",
            ...getColumnSearchProps("genero"),
          },
          {
            title: "Estado",
            dataIndex: ["location", "state"],
            ...getColumnSearchProps("regiao"),
          },
          {
            title: "Cidade",
            dataIndex: ["location", "city"],
            ...getColumnSearchProps("cidade"),
          },
          {
            title: "Logradouro",
            dataIndex: ["location", "street"],
            ...getColumnSearchProps("logradouro"),
          },
        ]}
        pagination={{
          pageSize: filters.rowsPerPage,
          current: filters.page + 1,
          defaultCurrent: 1,
          defaultPageSize: 20,
          total: data.total,
          onChange: handlePaginationChange,
          showQuickJumper: true,
        }}
      />
    </>
  );
}

export default App;
