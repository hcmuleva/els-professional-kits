import React from "react";
import { Form, Input, Button, Card, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const CreateController = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Final Form Values:", values);
  };

  
  return (
  
   <Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ businessTypes: [] }}>
      <Form.List name="businessTypes">
        {(types, { add: addType, remove: removeType }) => (
          <>
            {types.map(({ key: typeKey, name: typeName, ...restTypeField }) => (
              <Card
                key={typeKey}
                title={`Type`}
                style={{ marginBottom: 24 }}
                extra={<MinusCircleOutlined onClick={() => removeType(typeName)} />}
              >
                <Form.Item
                  {...restTypeField}
                  name={[typeName, "type"]}
                  label="Type (English)"
                  rules={[{ required: true, message: "Type is required" }]}
                >
                  <Input placeholder="Enter Type (e.g. Retail)" />
                </Form.Item>
                <Form.Item
                  {...restTypeField}
                  name={[typeName, "type_hi"]}
                  label="Type (Hindi)"
                  rules={[{ required: true, message: "Type (Hindi) is required" }]}
                >
                  <Input placeholder="Enter Hindi name" />
                </Form.Item>

                <Form.List name={[typeName, "subtypes"]}>
                  {(subtypes, { add: addSubtype, remove: removeSubtype }) => (
                    <>
                      {subtypes.map(({ key: subtypeKey, name: subtypeName, ...restSubtypeField }) => (
                        <Card
                          key={subtypeKey}
                          type="inner"
                          title="Subtype"
                          style={{ marginBottom: 16 }}
                          extra={<MinusCircleOutlined onClick={() => removeSubtype(subtypeName)} />}
                        >
                          <Form.Item
                            {...restSubtypeField}
                            name={[subtypeName, "subtype"]}
                            label="Subtype (English)"
                            rules={[{ required: true, message: "Subtype is required" }]}
                          >
                            <Input placeholder="Enter Subtype (e.g. Shop)" />
                          </Form.Item>
                          <Form.Item
                            {...restSubtypeField}
                            name={[subtypeName, "subtype_hi"]}
                            label="Subtype (Hindi)"
                            rules={[{ required: true, message: "Subtype (Hindi) is required" }]}
                          >
                            <Input placeholder="Enter Hindi name" />
                          </Form.Item>

                          <Form.List name={[subtypeName, "categories"]}>
                            {(categories, { add: addCategory, remove: removeCategory }) => (
                              <>
                                {categories.map(({ key: categoryKey, name: categoryName, ...restCategoryField }) => (
                                  <Card
                                    key={categoryKey}
                                    type="inner"
                                    title="Category"
                                    style={{ marginBottom: 12, marginLeft: 24 }}
                                    extra={<MinusCircleOutlined onClick={() => removeCategory(categoryName)} />}
                                  >
                                    <Form.Item
                                      {...restCategoryField}
                                      name={[categoryName, "category"]}
                                      label="Category (English)"
                                      rules={[{ required: true, message: "Category is required" }]}
                                    >
                                      <Input placeholder="Enter Category (e.g. Grocery)" />
                                    </Form.Item>
                                    <Form.Item
                                      {...restCategoryField}
                                      name={[categoryName, "category_hi"]}
                                      label="Category (Hindi)"
                                      rules={[{ required: true, message: "Category (Hindi) is required" }]}
                                    >
                                      <Input placeholder="Enter Hindi name" />
                                    </Form.Item>

                                    <Form.List name={[categoryName, "subcategories"]}>
                                      {(subcategories, { add: addSubcategory, remove: removeSubcategory }) => (
                                        <>
                                          {subcategories.map(({ key: subKey, name: subName, ...restSubField }) => (
                                            <Space
                                              key={subKey}
                                              style={{ display: "flex", marginBottom: 8, marginLeft: 40 }}
                                              align="baseline"
                                            >
                                              <Form.Item
                                                {...restSubField}
                                                name={[subName, "subcategory"]}
                                                label="Subcategory (English)"
                                                rules={[{ required: true, message: "Subcategory is required" }]}
                                              >
                                                <Input placeholder="e.g. Organic Products" />
                                              </Form.Item>
                                              <Form.Item
                                                {...restSubField}
                                                name={[subName, "subcategory_hi"]}
                                                label="Subcategory (Hindi)"
                                                rules={[{ required: true, message: "Subcategory (Hindi) is required" }]}
                                              >
                                                <Input placeholder="Hindi name" />
                                              </Form.Item>
                                              <MinusCircleOutlined onClick={() => removeSubcategory(subName)} />
                                            </Space>
                                          ))}
                                          <Form.Item style={{ marginLeft: 40 }}>
                                            <Button
                                              type="dashed"
                                              onClick={() => addSubcategory()}
                                              icon={<PlusOutlined />}
                                            >
                                              Add Subcategory
                                            </Button>
                                          </Form.Item>
                                        </>
                                      )}
                                    </Form.List>
                                  </Card>
                                ))}
                                <Form.Item style={{ marginLeft: 24 }}>
                                  <Button
                                    type="dashed"
                                    onClick={() => addCategory()}
                                    icon={<PlusOutlined />}
                                  >
                                    Add Category
                                  </Button>
                                </Form.Item>
                              </>
                            )}
                          </Form.List>
                        </Card>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => addSubtype()}
                          icon={<PlusOutlined />}
                        >
                          Add Subtype
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => addType()}
                block
                icon={<PlusOutlined />}
              >
                Add Business Type
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save All
        </Button>
      </Form.Item>
    </Form>);
};


export default CreateController;
