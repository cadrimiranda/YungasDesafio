import React from "react";
import { Image, Space, Drawer, Row, Col, Card } from "antd";

import "./Preview.scss";
import { pessoa } from "./mock/api/api";

const Preview = ({
  data,
  visible,
  onClose,
}: {
  data: pessoa | null;
  visible: boolean;
  onClose: Function;
}) => {
  return (
    <Drawer
      className="preview"
      width="auto"
      visible={visible}
      onClose={() => onClose()}
    >
      <aside>
        {data && (
          <Space direction="vertical">
            <Card id="informacoes-usuario" className="preview-card">
              <Row>
                <Col md={6}>
                  <Image
                    className="preview-image"
                    src={data.picture.medium}
                    alt="image"
                  />
                </Col>
                <Col md={18}>
                  <h1 className="preview-titulo">
                    {`${data.name.title}. ${data.name.last}, ${data.name.first}`.toUpperCase()}
                  </h1>
                  <h2>{`${data.gender}, ${data.dob.age}`}</h2>
                </Col>
                <Col md={24}>
                  <label htmlFor="informacoes-usuario">
                    <b>Endereço:</b>
                    {` ${data.location.street}, ${data.location.postcode} - ${data.location.city} / ${data.location.state}`}
                  </label>
                  <br />
                  <label htmlFor="informacoes-usuario">
                    <b>E-mail:</b>
                    {` ${data.email}`}
                  </label>
                  <br />
                  <label htmlFor="informacoes-usuario">
                    <b>Fone:</b>
                    {` ${data.phone} - Cel: ${data.cell}`}
                  </label>
                </Col>
              </Row>
            </Card>
          </Space>
        )}
      </aside>
    </Drawer>
  );
};

export default Preview;
