CREATE TABLE Colours (
  TransactionID BIGINT NOT NULL AUTO_INCREMENT,
  UserID BIGINT,
  Hue DECIMAL(6,3),
  Sat DECIMAL(6,3),
  Val DECIMAL(6,3),
  Count INT,
  PRIMARY KEY (TransactionID)
);

INSERT INTO Colours (
  UserID,
  Hue,
  Sat,
  Val,
  Count
) VALUES (
  123,
  3.4,
  42,
  12.53,
  23
);