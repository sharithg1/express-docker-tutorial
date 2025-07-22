/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async (pgm) => {
  // Insert users
  const users = await pgm.db.query(`
    INSERT INTO users (email, name) VALUES
    ('john@example.com', 'John Doe'),
    ('jane@example.com', 'Jane Smith'),
    ('bob@example.com', 'Bob Johnson')
    RETURNING id;
  `);

  const userIds = users.rows.map((row) => row.id);

  // Insert orders
  await pgm.db.query(
    `
    INSERT INTO orders (user_id, total_amount, status) VALUES
    ($1, 99.99, 'completed'),
    ($1, 150.50, 'pending'),
    ($2, 75.25, 'completed'),
    ($3, 200.00, 'processing')
  `,
    [userIds[0], userIds[1], userIds[2]]
  );
};

exports.down = async (pgm) => {
  await pgm.db.query("DELETE FROM orders");
  await pgm.db.query("DELETE FROM users");
};
