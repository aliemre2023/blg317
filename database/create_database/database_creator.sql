-----------------------------------------------------------------
-- DATABASE GENERATOR
-----------------------------------------------------------------

-----------------------------------------------------------------
-- admins
-----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(30) UNIQUE CHECK(username NOT LIKE '%.%' AND
                                     username NOT LIKE '.%' AND
                                     username NOT LIKE '%.' AND
                                     username NOT LIKE '% %' AND
                                     username GLOB '[A-Za-z0-9._]*'
    ),
    mail VARCHAR(30) UNIQUE CHECK (mail LIKE '%@%.%' AND
                            LENGTH(mail) >= 7
    ),
    password_hash VARCHAR(60) NOT NULL,
    last_login DATE DEFAULT (CURRENT_TIMESTAMP),
    creation_date DATE DEFAULT (CURRENT_TIMESTAMP)

);

-- Rename the existing table
ALTER TABLE admins RENAME TO admins_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS admins (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(30) UNIQUE
        CHECK(
            username NOT LIKE '%.%' AND
            username NOT LIKE '.%' AND
            username NOT LIKE '%.' AND
            username NOT LIKE '% %' AND
            username GLOB '[A-Za-z0-9._]*' AND
            LENGTH(username) >= 3 AND
            LENGTH(username) <= 30
        ),
    mail VARCHAR(30) UNIQUE
        CHECK(
            mail LIKE '%@%.%' AND
            LENGTH(mail) >= 7 AND
            mail NOT LIKE '%@%@%' AND
            mail NOT LIKE '%..%' AND
            mail NOT LIKE '%.@%' AND
            mail NOT LIKE '%@.%'
        ),
    password_hash VARCHAR(60) NOT NULL
        CHECK(LENGTH(password_hash) = 60),
    last_login DATE DEFAULT (CURRENT_TIMESTAMP),
    creation_date DATE DEFAULT (CURRENT_TIMESTAMP)
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO admins (admin_id, username, mail, password_hash)
SELECT admin_id, username, mail, password_hash
FROM admins_old
WHERE
    username NOT LIKE '%.%' AND
    username NOT LIKE '.%' AND
    username NOT LIKE '%.' AND
    username NOT LIKE '% %' AND
    username GLOB '[A-Za-z0-9._]*' AND
    LENGTH(username) >= 3 AND
    LENGTH(username) <= 30 AND
    mail LIKE '%@%.%' AND
    LENGTH(mail) >= 7 AND
    mail NOT LIKE '%@%@%' AND
    mail NOT LIKE '%..%' AND
    mail NOT LIKE '%.@%' AND
    mail NOT LIKE '%@.%' AND
    LENGTH(password_hash) = 60;

-- Drop the old table
DROP TABLE admins_old;

-----------------------------------------------------------------
-- countries
-----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS countries (
    country_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100),
    abbreviation VARCHAR(10),
    flag_link VARCHAR(255)
);

INSERT INTO countries (name, abbreviation, flag_link) VALUES
( 'Afghanistan', 'AF', 'https://www.worldometers.info/img/flags/small/tn_af-flag.gif'),
( 'Albania', 'AL', 'https://www.worldometers.info/img/flags/small/tn_al-flag.gif'),
( 'Algeria', 'DZ', 'https://www.worldometers.info/img/flags/small/tn_ag-flag.gif'),
( 'Andorra', 'AD', 'https://www.worldometers.info/img/flags/small/tn_ad-flag.gif'),
( 'Angola', 'AO', 'https://www.worldometers.info/img/flags/small/tn_ao-flag.gif'),
( 'Antigua and Barbuda', 'AG', 'https://www.worldometers.info/img/flags/small/tn_ag-flag.gif'),
( 'Argentina', 'AR', 'https://www.worldometers.info/img/flags/small/tn_ar-flag.gif'),
( 'Armenia', 'AM', 'https://www.worldometers.info/img/flags/small/tn_am-flag.gif'),
( 'Australia', 'AU', 'https://www.worldometers.info/img/flags/small/tn_au-flag.gif'),
( 'Austria', 'AT', 'https://www.worldometers.info/img/flags/small/tn_at-flag.gif'),
( 'Azerbaijan', 'AZ', 'https://www.worldometers.info/img/flags/small/tn_az-flag.gif'),
( 'Bahamas', 'BS', 'https://www.worldometers.info/img/flags/small/tn_bs-flag.gif'),
( 'Bahrain', 'BH', 'https://www.worldometers.info/img/flags/small/tn_bh-flag.gif'),
( 'Bangladesh', 'BD', 'https://www.worldometers.info/img/flags/small/tn_bd-flag.gif'),
( 'Barbados', 'BB', 'https://www.worldometers.info/img/flags/small/tn_bb-flag.gif'),
( 'Belarus', 'BY', 'https://www.worldometers.info/img/flags/small/tn_by-flag.gif'),
( 'Belgium', 'BE', 'https://www.worldometers.info/img/flags/small/tn_be-flag.gif'),
( 'Belize', 'BZ', 'https://www.worldometers.info/img/flags/small/tn_bz-flag.gif'),
( 'Benin', 'BJ', 'https://www.worldometers.info/img/flags/small/tn_bj-flag.gif'),
( 'Bhutan', 'BT', 'https://www.worldometers.info/img/flags/small/tn_bt-flag.gif'),
( 'Bolivia', 'BO', 'https://www.worldometers.info/img/flags/small/tn_bo-flag.gif'),
( 'Bosnia and Herzegovina', 'BA', 'https://www.worldometers.info/img/flags/small/tn_ba-flag.gif'),
( 'Botswana', 'BW', 'https://www.worldometers.info/img/flags/small/tn_bw-flag.gif'),
( 'Brazil', 'BR', 'https://www.worldometers.info/img/flags/small/tn_br-flag.gif'),
( 'Brunei', 'BN', 'https://www.worldometers.info/img/flags/small/tn_bn-flag.gif'),
( 'Bulgaria', 'BG', 'https://www.worldometers.info/img/flags/small/tn_bg-flag.gif'),
( 'Burkina Faso', 'BF', 'https://www.worldometers.info/img/flags/small/tn_bf-flag.gif'),
( 'Burundi', 'BI', 'https://www.worldometers.info/img/flags/small/tn_bi-flag.gif'),
( 'Cabo Verde', 'CV', 'https://www.worldometers.info/img/flags/small/tn_cv-flag.gif'),
( 'Cambodia', 'KH', 'https://www.worldometers.info/img/flags/small/tn_kh-flag.gif'),
( 'Cameroon', 'CM', 'https://www.worldometers.info/img/flags/small/tn_cm-flag.gif'),
( 'Canada', 'CA', 'https://www.worldometers.info/img/flags/small/tn_ca-flag.gif'),
( 'Central African Republic', 'CF', 'https://www.worldometers.info/img/flags/small/tn_cf-flag.gif'),
( 'Chad', 'TD', 'https://www.worldometers.info/img/flags/small/tn_td-flag.gif'),
( 'Chile', 'CL', 'https://www.worldometers.info/img/flags/small/tn_cl-flag.gif'),
( 'China', 'CN', 'https://www.worldometers.info/img/flags/small/tn_ch-flag.gif'),
( 'Colombia', 'CO', 'https://www.worldometers.info/img/flags/small/tn_co-flag.gif'),
( 'Comoros', 'KM', 'https://www.worldometers.info/img/flags/small/tn_km-flag.gif'),
( 'Congo (Congo-Brazzaville)', 'CG', 'https://www.worldometers.info/img/flags/small/tn_cg-flag.gif'),
( 'Congo (Democratic Republic)', 'CD', 'https://www.worldometers.info/img/flags/small/tn_cd-flag.gif'),
( 'Costa Rica', 'CR', 'https://www.worldometers.info/img/flags/small/tn_cr-flag.gif'),
( 'Croatia', 'HR', 'https://www.worldometers.info/img/flags/small/tn_hr-flag.gif'),
( 'Cuba', 'CU', 'https://www.worldometers.info/img/flags/small/tn_cu-flag.gif'),
( 'Cyprus', 'CY', 'https://www.worldometers.info/img/flags/small/tn_cy-flag.gif'),
( 'Czech Republic', 'CZ', 'https://www.worldometers.info/img/flags/small/tn_cz-flag.gif'),
( 'Denmark', 'DK', 'https://www.worldometers.info/img/flags/small/tn_da-flag.gif'),
( 'Djibouti', 'DJ', 'https://www.worldometers.info/img/flags/small/tn_dj-flag.gif'),
( 'Dominica', 'DM', 'https://www.worldometers.info/img/flags/small/tn_dm-flag.gif'),
( 'Dominican Republic', 'DO', 'https://www.worldometers.info/img/flags/small/tn_dr-flag.gif'),
( 'Ecuador', 'EC', 'https://www.worldometers.info/img/flags/small/tn_ec-flag.gif'),
( 'Egypt', 'EG', 'https://www.worldometers.info/img/flags/small/tn_eg-flag.gif'),
( 'El Salvador', 'SV', 'https://www.worldometers.info/img/flags/small/tn_es-flag.gif'),
( 'Equatorial Guinea', 'GQ', 'https://www.worldometers.info/img/flags/small/tn_gq-flag.gif'),
( 'Eritrea', 'ER', 'https://www.worldometers.info/img/flags/small/tn_er-flag.gif'),
( 'Estonia', 'EE', 'https://www.worldometers.info/img/flags/small/tn_ee-flag.gif'),
( 'Eswatini', 'SZ', 'https://www.worldometers.info/img/flags/small/tn_wz-flag.gif'),
( 'Ethiopia', 'ET', 'https://www.worldometers.info/img/flags/small/tn_et-flag.gif'),
( 'Fiji', 'FJ', 'https://www.worldometers.info/img/flags/small/tn_fj-flag.gif'),
( 'Finland', 'FI', 'https://www.worldometers.info/img/flags/small/tn_fi-flag.gif'),
( 'France', 'FR', 'https://www.worldometers.info/img/flags/small/tn_fr-flag.gif'),
( 'Gabon', 'GA', 'https://www.worldometers.info/img/flags/small/tn_ga-flag.gif'),
( 'Gambia', 'GM', 'https://www.worldometers.info/img/flags/small/tn_ga-flag.gif'),
( 'Georgia', 'GE', 'https://www.worldometers.info/img/flags/small/tn_gg-flag.gif'),
( 'Germany', 'DE', 'https://www.worldometers.info/img/flags/small/tn_gm-flag.gif'),
( 'Ghana', 'GH', 'https://www.worldometers.info/img/flags/small/tn_gh-flag.gif'),
( 'Greece', 'GR', 'https://www.worldometers.info/img/flags/small/tn_gr-flag.gif'),
( 'Grenada', 'GD', 'https://www.worldometers.info/img/flags/small/tn_gj-flag.gif'),
( 'Guatemala', 'GT', 'https://www.worldometers.info/img/flags/small/tn_gt-flag.gif'),
( 'Guinea', 'GN', 'https://www.worldometers.info/img/flags/small/tn_gv-flag.gif'),
( 'Guinea-Bissau', 'GW', 'https://www.worldometers.info/img/flags/small/tn_pu-flag.gif'),
( 'Guyana', 'GY', 'https://www.worldometers.info/img/flags/small/tn_gy-flag.gif'),
( 'Haiti', 'HT', 'https://www.worldometers.info/img/flags/small/tn_ha-flag.gif'),
( 'Honduras', 'HN', 'https://www.worldometers.info/img/flags/small/tn_ho-flag.gif'),
( 'Hungary', 'HU', 'https://www.worldometers.info/img/flags/small/tn_hu-flag.gif'),
( 'Iceland', 'IS', 'https://www.worldometers.info/img/flags/small/tn_ic-flag.gif'),
( 'India', 'IN', 'https://www.worldometers.info/img/flags/small/tn_in-flag.gif'),
( 'Indonesia', 'ID', 'https://www.worldometers.info/img/flags/small/tn_id-flag.gif'),
( 'Iran', 'IR', 'https://www.worldometers.info/img/flags/small/tn_ir-flag.gif'),
( 'Iraq', 'IQ', 'https://www.worldometers.info/img/flags/small/tn_iz-flag.gif'),
( 'Ireland', 'IE', 'https://www.worldometers.info/img/flags/small/tn_ei-flag.gif'),
( 'Israel', 'IL', 'https://www.worldometers.info/img/flags/small/tn_is-flag.gif'),
( 'Italy', 'IT', 'https://www.worldometers.info/img/flags/small/tn_it-flag.gif'),
( 'Jamaica', 'JM', 'https://www.worldometers.info/img/flags/small/tn_jm-flag.gif'),
( 'Japan', 'JP', 'https://www.worldometers.info/img/flags/small/tn_ja-flag.gif'),
( 'Jordan', 'JO', 'https://www.worldometers.info/img/flags/small/tn_jo-flag.gif'),
( 'Kazakhstan', 'KZ', 'https://www.worldometers.info/img/flags/small/tn_kz-flag.gif'),
( 'Kenya', 'KE', 'https://www.worldometers.info/img/flags/small/tn_ke-flag.gif'),
( 'Kiribati', 'KI', 'https://www.worldometers.info/img/flags/small/tn_kr-flag.gif'),
( 'Korea (North)', 'KP', 'https://www.worldometers.info/img/flags/small/tn_kn-flag.gif'),
( 'Korea (South)', 'KR', 'https://www.worldometers.info/img/flags/small/tn_ks-flag.gif'),
( 'Kuwait', 'KW', 'https://www.worldometers.info/img/flags/small/tn_ku-flag.gif'),
( 'Kyrgyzstan', 'KG', 'https://www.worldometers.info/img/flags/small/tn_kg-flag.gif'),
( 'Laos', 'LA', 'https://www.worldometers.info/img/flags/small/tn_la-flag.gif'),
( 'Latvia', 'LV', 'https://www.worldometers.info/img/flags/small/tn_lg-flag.gif'),
( 'Lebanon', 'LB', 'https://www.worldometers.info/img/flags/small/tn_le-flag.gif'),
( 'Lesotho', 'LS', 'https://www.worldometers.info/img/flags/small/tn_lt-flag.gif'),
( 'Liberia', 'LR', 'https://www.worldometers.info/img/flags/small/tn_li-flag.gif'),
( 'Libya', 'LY', 'https://www.worldometers.info/img/flags/small/tn_ly-flag.gif'),
( 'Liechtenstein', 'LI', 'https://www.worldometers.info/img/flags/small/tn_ls-flag.gif'),
( 'Lithuania', 'LT', 'https://www.worldometers.info/img/flags/small/tn_lh-flag.gif'),
( 'Luxembourg', 'LU', 'https://www.worldometers.info/img/flags/small/tn_lu-flag.gif'),
( 'Madagascar', 'MG', 'https://www.worldometers.info/img/flags/small/tn_ma-flag.gif'),
( 'Malawi', 'MW', 'https://www.worldometers.info/img/flags/small/tn_mi-flag.gif'),
( 'Malaysia', 'MY', 'https://www.worldometers.info/img/flags/small/tn_my-flag.gif'),
( 'Maldives', 'MV', 'https://www.worldometers.info/img/flags/small/tn_mv-flag.gif'),
( 'Mali', 'ML', 'https://www.worldometers.info/img/flags/small/tn_ml-flag.gif'),
( 'Malta', 'MT', 'https://www.worldometers.info/img/flags/small/tn_mt-flag.gif'),
( 'Marshall Islands', 'MH', 'https://www.worldometers.info/img/flags/small/tn_rm-flag.gif'),
( 'Mauritania', 'MR', 'https://www.worldometers.info/img/flags/small/tn_mr-flag.gif'),
( 'Mauritius', 'MU', 'https://www.worldometers.info/img/flags/small/tn_mp-flag.gif'),
( 'Mexico', 'MX', 'https://www.worldometers.info/img/flags/small/tn_mx-flag.gif'),
( 'Micronesia', 'FM', 'https://www.worldometers.info/img/flags/small/tn_fm-flag.gif'),
( 'Moldova', 'MD', 'https://www.worldometers.info/img/flags/small/tn_md-flag.gif'),
( 'Monaco', 'MC', 'https://www.worldometers.info/img/flags/small/tn_mn-flag.gif'),
( 'Mongolia', 'MN', 'https://www.worldometers.info/img/flags/small/tn_mg-flag.gif'),
( 'Montenegro', 'ME', 'https://www.worldometers.info/img/flags/small/tn_mj-flag.gif'),
( 'Morocco', 'MA', 'https://www.worldometers.info/img/flags/small/tn_mo-flag.gif'),
( 'Mozambique', 'MZ', 'https://www.worldometers.info/img/flags/small/tn_mz-flag.gif'),
( 'Myanmar', 'MM', 'https://www.worldometers.info/img/flags/small/tn_bm-flag.gif'),
( 'Namibia', 'NA', 'https://www.worldometers.info/img/flags/small/tn_wa-flag.gif'),
( 'Nauru', 'NR', 'https://www.worldometers.info/img/flags/small/tn_nr-flag.gif'),
( 'Nepal', 'NP', 'https://www.worldometers.info/img/flags/small/tn_np-flag.gif'),
( 'Netherlands', 'NL', 'https://www.worldometers.info/img/flags/small/tn_nl-flag.gif'),
( 'New Zealand', 'NZ', 'https://www.worldometers.info/img/flags/small/tn_nz-flag.gif'),
( 'Nicaragua', 'NI', 'https://www.worldometers.info/img/flags/small/tn_nu-flag.gif'),
( 'Niger', 'NE', 'https://www.worldometers.info/img/flags/small/tn_ng-flag.gif'),
( 'Nigeria', 'NG', 'https://www.worldometers.info/img/flags/small/tn_ni-flag.gif'),
( 'North Macedonia', 'MK', 'https://www.worldometers.info/img/flags/small/tn_mk-flag.gif'),
( 'Norway', 'NO', 'https://www.worldometers.info/img/flags/small/tn_no-flag.gif'),
( 'Oman', 'OM', 'https://www.worldometers.info/img/flags/small/tn_mu-flag.gif'),
( 'Pakistan', 'PK', 'https://www.worldometers.info/img/flags/small/tn_pk-flag.gif'),
( 'Palau', 'PW', 'https://www.worldometers.info/img/flags/small/tn_ps-flag.gif'),
( 'Panama', 'PA', 'https://www.worldometers.info/img/flags/small/tn_pm-flag.gif'),
( 'Papua New Guinea', 'PG', 'https://www.worldometers.info/img/flags/small/tn_pp-flag.gif'),
( 'Paraguay', 'PY', 'https://www.worldometers.info/img/flags/small/tn_pa-flag.gif'),
( 'Peru', 'PE', 'https://www.worldometers.info/img/flags/small/tn_pe-flag.gif'),
( 'Philippines', 'PH', 'https://www.worldometers.info/img/flags/small/tn_rp-flag.gif'),
( 'Poland', 'PL', 'https://www.worldometers.info/img/flags/small/tn_pl-flag.gif'),
( 'Portugal', 'PT', 'https://www.worldometers.info/img/flags/small/tn_po-flag.gif'),
( 'Qatar', 'QA', 'https://www.worldometers.info/img/flags/small/tn_qa-flag.gif'),
( 'Romania', 'RO', 'https://www.worldometers.info/img/flags/small/tn_ro-flag.gif'),
( 'Russia', 'RU', 'https://www.worldometers.info/img/flags/small/tn_rs-flag.gif'),
( 'Rwanda', 'RW', 'https://www.worldometers.info/img/flags/small/tn_rw-flag.gif'),
( 'Saint Kitts and Nevis', 'KN', 'https://www.worldometers.info/img/flags/small/tn_sc-flag.gif'),
( 'Saint Lucia', 'LC', 'https://www.worldometers.info/img/flags/small/tn_st-flag.gif'),
( 'Saint Vincent and the Grenadines', 'VC', 'https://www.worldometers.info/img/flags/small/tn_vc-flag.gif'),
( 'Samoa', 'WS', 'https://www.worldometers.info/img/flags/small/tn_ws-flag.gif'),
( 'San Marino', 'SM', 'https://www.worldometers.info/img/flags/small/tn_sm-flag.gif'),
( 'Sao Tome and Principe', 'ST', 'https://www.worldometers.info/img/flags/small/tn_tp-flag.gif'),
( 'Saudi Arabia', 'SA', 'https://www.worldometers.info/img/flags/small/tn_sa-flag.gif'),
( 'Senegal', 'SN', 'https://www.worldometers.info/img/flags/small/tn_sg-flag.gif'),
( 'Serbia', 'RS', 'https://www.worldometers.info/img/flags/small/tn_ri-flag.gif'),
( 'Seychelles', 'SC', 'https://www.worldometers.info/img/flags/small/tn_se-flag.gif'),
( 'Sierra Leone', 'SL', 'https://www.worldometers.info/img/flags/small/tn_sl-flag.gif'),
( 'Singapore', 'SG', 'https://www.worldometers.info/img/flags/small/tn_sn-flag.gif'),
( 'Slovakia', 'SK', 'https://www.worldometers.info/img/flags/small/tn_lo-flag.gif'),
( 'Slovenia', 'SI', 'https://www.worldometers.info/img/flags/small/tn_si-flag.gif'),
( 'Solomon Islands', 'SB', 'https://www.worldometers.info/img/flags/small/tn_bp-flag.gif'),
( 'Somalia', 'SO', 'https://www.worldometers.info/img/flags/small/tn_so-flag.gif'),
( 'South Africa', 'ZA', 'https://www.worldometers.info/img/flags/small/tn_sf-flag.gif'),
( 'South Sudan', 'SS', 'https://www.worldometers.info/img/flags/small/tn_od-flag.gif'),
( 'Spain', 'ES', 'https://www.worldometers.info/img/flags/small/tn_sp-flag.gif'),
( 'Sri Lanka', 'LK', 'https://www.worldometers.info/img/flags/small/tn_ce-flag.gif'),
( 'Sudan', 'SD', 'https://www.worldometers.info/img/flags/small/tn_su-flag.gif'),
( 'Suriname', 'SR', 'https://www.worldometers.info/img/flags/small/tn_ns-flag.gif'),
( 'Sweden', 'SE', 'https://www.worldometers.info/img/flags/small/tn_sw-flag.gif'),
( 'Switzerland', 'CH', 'https://www.worldometers.info/img/flags/small/tn_sz-flag.gif'),
( 'Syria', 'SY', 'https://www.worldometers.info/img/flags/small/tn_sy-flag.gif'),
( 'Taiwan', 'TW', 'https://www.worldometers.info/img/flags/small/tn_tw-flag.gif'),
( 'Tajikistan', 'TJ', 'https://www.worldometers.info/img/flags/small/tn_ti-flag.gif'),
( 'Tanzania', 'TZ', 'https://www.worldometers.info/img/flags/small/tn_tz-flag.gif'),
( 'Thailand', 'TH', 'https://www.worldometers.info/img/flags/small/tn_th-flag.gif'),
( 'Togo', 'TG', 'https://www.worldometers.info/img/flags/small/tn_to-flag.gif'),
( 'Tonga', 'TO', 'https://www.worldometers.info/img/flags/small/tn_tn-flag.gif'),
( 'Trinidad and Tobago', 'TT', 'https://www.worldometers.info/img/flags/small/tn_td-flag.gif'),
( 'Tunisia', 'TN', 'https://www.worldometers.info/img/flags/small/tn_ts-flag.gif'),
( 'Turkey', 'TR', 'https://www.worldometers.info/img/flags/small/tn_tu-flag.gif'),
( 'Turkmenistan', 'TM', 'https://www.worldometers.info/img/flags/small/tn_tx-flag.gif'),
( 'Tuvalu', 'TV', 'https://www.worldometers.info/img/flags/small/tn_tv-flag.gif'),
( 'Uganda', 'UG', 'https://www.worldometers.info/img/flags/small/tn_ug-flag.gif'),
( 'Ukraine', 'UA', 'https://www.worldometers.info/img/flags/small/tn_up-flag.gif'),
( 'United Arab Emirates', 'AE', 'https://www.worldometers.info/img/flags/small/tn_ae-flag.gif'),
( 'United Kingdom', 'GB', 'https://www.worldometers.info/img/flags/small/tn_uk-flag.gif'),
( 'United States', 'US', 'https://www.worldometers.info/img/flags/small/tn_us-flag.gif'),
( 'Uruguay', 'UY', 'https://www.worldometers.info/img/flags/small/tn_uy-flag.gif'),
( 'Uzbekistan', 'UZ', 'https://www.worldometers.info/img/flags/small/tn_uz-flag.gif'),
( 'Vanuatu', 'VU', 'https://www.worldometers.info/img/flags/small/tn_ve-flag.gif'),
( 'Vatican City', 'VA', 'https://www.worldometers.info/img/flags/small/tn_vt-flag.gif'),
( 'Venezuela', 'VE', 'https://www.worldometers.info/img/flags/small/tn_ve-flag.gif'),
( 'Vietnam', 'VN', 'https://www.worldometers.info/img/flags/small/tn_vm-flag.gif'),
( 'Yemen', 'YE', 'https://www.worldometers.info/img/flags/small/tn_ym-flag.gif'),
( 'Zambia', 'ZM', 'https://www.worldometers.info/img/flags/small/tn_za-flag.gif'),
( 'Zimbabwe', 'ZW', 'https://www.worldometers.info/img/flags/small/tn_zi-flag.gif'),
( 'Scotland', 'SCO', 'https://en.wikipedia.org/wiki/Scotland#/media/File:Flag_of_Scotland.svg'),
( 'Puerto Rico', 'PR', 'https://upload.wikimedia.org/wikipedia/commons/2/28/Flag_of_Puerto_Rico.svg'),
( 'US Virgin Islands', 'USVI', 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Flag_of_the_United_States_Virgin_Islands.svg');

-- Rename the existing table
ALTER TABLE countries RENAME TO countries_old;

-- Create the new table with the unique abbreviation constraint
CREATE TABLE IF NOT EXISTS countries (
    country_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100),
    abbreviation VARCHAR(10) UNIQUE, 
    flag_link VARCHAR(255)
);

-- Insert data from the old table to the new table, handling potential duplicate abbreviations
INSERT INTO countries (name, abbreviation, flag_link)
SELECT name, abbreviation, flag_link
FROM countries_old
WHERE abbreviation NOT IN (
    SELECT abbreviation FROM countries -- Exclude rows with duplicate abbreviations
);

-- Drop the old table
DROP TABLE countries_old;


-----------------------------------------------------------------
-- states
-----------------------------------------------------------------
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS states (
    state_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name  varchar NOT NULL,
    country_id INTEGER,

    FOREIGN KEY (country_id) REFERENCES countries(country_id)
        ON DELETE CASCADE
);

INSERT INTO states (name, country_id)
VALUES
    ('Georgia', 184),
    ('Massachusetts', 184),
    ('Ohio', 184),
    ('Louisiana', 184),
    ('Illinois', 184),
    ('Texas', 184),
    ('Colorado', 184),
    ('California', 184),
    ('Florida', 184),
    ('Wisconsin', 184),
    ('Minnesota', 184),
    ('New York', 184),
    ('Indiana', 184),
    ('Pennsylvania', 184),
    ('Arizona', 184),
    ('Oregon', 184),
    ('Oklahoma', 184),
    ('Ontario', 32),  -- Ontario has a different country_id
    ('Utah', 184),
    ('Tennessee', 184),
    ('District of Columbia', 184),
    ('Michigan', 184),
    ('North Carolina', 184);


-- Rename the existing table
ALTER TABLE states RENAME TO states_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS states (
    state_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL CHECK (length(trim(name)) > 0), -- Ensure state name is not empty
    country_id INTEGER,

    FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE CASCADE
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO states (state_id, name, country_id)
SELECT
    state_id,
    name,
    country_id
FROM states_old
WHERE length(trim(name)) > 0;

-- Drop the old table
DROP TABLE states_old;
-----------------------------------------------------------------
-- cities
-----------------------------------------------------------------
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cities (
    city_id INTEGER PRIMARY KEY AUTOINCREMENT ,
    name VARCHAR NOT NULL,
    abbreviation VARCHAR NOT NULL,
    state_id INTEGER,
    coordinate_x DOUBLE PRECISION(10, 4),
    coordinate_y DOUBLE PRECISION(10, 4),

    FOREIGN KEY (state_id) REFERENCES states(state_id)
        ON DELETE CASCADE
);

INSERT INTO cities (name, abbreviation, state_id, coordinate_x, coordinate_y) VALUES
('Atlanta', 'ATL', 1, 33.7490, -84.3880),               -- Georgia
( 'Boston', 'BOS', 2, 42.3601, -71.0589),                -- Massachusetts
('Cleveland', 'CLE', 3, 41.4995, -81.6954),             -- Ohio
('New Orleans', 'NO', 4, 29.9511, -90.0715),            -- Louisiana
('Chicago', 'CHI', 5, 41.8781, -87.6298),               -- Illinois
('Dallas', 'DAL', 6, 32.7767, -96.7970),                -- Texas
('Denver', 'DEN', 7, 39.7392, -104.9903),               -- Colorado
('Golden State', 'GSW', 8, 37.7749, -122.4194),         -- California
('Houston', 'HOU', 6, 29.7604, -95.3698),               -- Texas
('Los Angeles', 'LA', 8, 34.0522, -118.2437),          -- California
('Miami', 'MIA', 9, 25.7617, -80.1918),                -- Florida
('Milwaukee', 'MIL', 10, 43.0389, -87.9065),           -- Wisconsin
('Minnesota', 'MIN', 11, 46.7296, -94.6859),           -- Minnesota
('Brooklyn', 'BKN', 12, 40.6782, -73.9442),            -- New York
('New York', 'NY', 12, 40.7128, -74.0060),             -- New York
('Orlando', 'ORL', 9, 28.5383, -81.3792),              -- Florida
('Indiana', 'IND', 13, 40.2672, -86.1349),             -- Indiana
('Philadelphia', 'PHI', 14, 39.9526, -75.1652),        -- Pennsylvania
('Phoenix', 'PHX', 15, 33.4484, -112.0740),            -- Arizona
('Portland', 'POR', 16, 45.5155, -122.6793),           -- Oregon
('Sacramento', 'SAC', 8, 38.5816, -121.4944),          -- California
('San Antonio', 'SA', 6, 29.4241, -98.4936),           -- Texas
('Oklahoma City', 'OKC', 17, 35.4676, -97.5164),       -- Oklahoma
('Toronto', 'TOR', 18, 43.6510, -79.3470),             -- Ontario (Canada)
('Utah', 'UTA', 19, 39.3200, -111.0937),               -- Utah
('Memphis', 'MEM', 20, 35.1495, -90.0490),             -- Tennessee
('Washington', 'WAS', 21, 38.9072, -77.0369),          -- District of Columbia
('Detroit', 'DET', 22, 42.3314, -83.0458),             -- Michigan
('Charlotte', 'CHA', 23, 35.2271, -80.8431);           -- North Carolina

-- Rename the existing table
ALTER TABLE cities RENAME TO cities_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS cities (
    city_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL CHECK(TRIM(name) != '' AND LENGTH(name) <= 100),
    abbreviation VARCHAR NOT NULL CHECK(LENGTH(abbreviation) BETWEEN 2 AND 5),
    state_id INTEGER,
    coordinate_x DOUBLE PRECISION CHECK(coordinate_x BETWEEN -90 AND 90),
    coordinate_y DOUBLE PRECISION CHECK(coordinate_y BETWEEN -180 AND 180),

    FOREIGN KEY (state_id) REFERENCES states(state_id) ON DELETE CASCADE
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO cities (city_id, name, abbreviation, state_id, coordinate_x, coordinate_y)
SELECT
    city_id,
    name,
    abbreviation,
    state_id,
    coordinate_x,
    coordinate_y
FROM cities_old
WHERE
    TRIM(name) != '' AND
    LENGTH(name) <= 100 AND
    LENGTH(abbreviation) BETWEEN 2 AND 5 AND
    coordinate_x BETWEEN -90 AND 90 AND
    coordinate_y BETWEEN -180 AND 180;

-- Drop the old table
DROP TABLE cities_old;
-----------------------------------------------------------------
-- arenas
-----------------------------------------------------------------
ATTACH DATABASE '/Users/aliemre2023/Downloads/archive/nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS arenas (
    arena_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR,
    capacity INTEGER
);


INSERT INTO arenas (name, capacity)
SELECT DISTINCT
    arena,
    arenacapacity
FROM nba_original.team_details
WHERE arena IS NOT NULL;

DETACH DATABASE nba_original;

-- Rename the existing table
ALTER TABLE arenas RENAME TO arenas_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS arenas (
    arena_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR CHECK(TRIM(name) != '' AND LENGTH(name) <= 100),
    capacity INTEGER CHECK(capacity >= 0) -- Ensures capacity is non-negative.
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO arenas (arena_id, name, capacity)
SELECT
    arena_id,
    name,
    CASE
        WHEN capacity > 0 THEN capacity
        ELSE 0
    END
FROM arenas_old
WHERE TRIM(name) != '' AND LENGTH(name) <= 100;

-- Drop the old table
DROP TABLE arenas_old;

-----------------------------------------------------------------
-- teams
-----------------------------------------------------------------
ATTACH DATABASE '/Users/aliemre2023/Downloads/archive/nba.sqlite' AS nba_original;
CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    abbreviation VARCHAR NOT NULL,
    nickname VARCHAR NOT NULL,
    year_founded TIMESTAMP,
    city_id INTEGER,
    arena_id INTEGER,
    owner TEXT,
    general_manager TEXT,
    headcoach TEXT,
    dleague_affiliation TEXT,
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,

    FOREIGN KEY (city_id) REFERENCES cities(city_id),
    FOREIGN KEY (arena_id) REFERENCES arenas(arena_id)
);

INSERT INTO teams(team_id, abbreviation, nickname, year_founded, owner, general_manager, headcoach, dleague_affiliation, facebook, instagram, twitter, city_id, arena_id)
SELECT
    team_id,
    abbreviation,
    nickname,
    yearfounded,
    owner,
    generalmanager,
    headcoach,
    dleagueaffiliation,
    facebook,
    instagram,
    twitter,
    (SELECT city_id FROM cities WHERE name = t.city) AS city_id,
    (SELECT arena_id FROM arenas WHERE name = t.arena) AS arena_id

FROM
    nba_original.team_details t;

ALTER TABLE teams
    ADD name TEXT NOT NULL DEFAULT '';

UPDATE teams
    SET name = (
        SELECT t.full_name
        FROM nba_original.team t
        WHERE t.abbreviation = teams.abbreviation
    )
    WHERE abbreviation IN (
        SELECT t.abbreviation
        FROM nba_original.team t
    );

DETACH DATABASE nba_original;

CREATE TABLE IF NOT EXISTS nba_team_flags (
    team_name VARCHAR(255) NOT NULL,
    abbreviation CHAR(3) NOT NULL,
    logo_url VARCHAR(255) NOT NULL
);

INSERT INTO nba_team_flags (team_name, abbreviation, logo_url) VALUES
('Atlanta Hawks', 'ATL', 'https://loodibee.com/wp-content/uploads/nba-atlanta-hawks-logo.png'),
('Boston Celtics', 'BOS', 'https://loodibee.com/wp-content/uploads/nba-boston-celtics-logo.png'),
('Brooklyn Nets', 'BKN', 'https://loodibee.com/wp-content/uploads/nba-brooklyn-nets-logo.png'),
('Charlotte Hornets', 'CHA', 'https://loodibee.com/wp-content/uploads/nba-charlotte-hornets-logo.png'),
('Chicago Bulls', 'CHI', 'https://loodibee.com/wp-content/uploads/nba-chicago-bulls-logo.png'),
('Cleveland Cavaliers', 'CLE', 'https://loodibee.com/wp-content/uploads/nba-cleveland-cavaliers-logo.png'),
('Dallas Mavericks', 'DAL', 'https://loodibee.com/wp-content/uploads/nba-dallas-mavericks-logo.png'),
('Denver Nuggets', 'DEN', 'https://loodibee.com/wp-content/uploads/nba-denver-nuggets-logo.png'),
('Detroit Pistons', 'DET', 'https://loodibee.com/wp-content/uploads/nba-detroit-pistons-logo.png'),
('Golden State Warriors', 'GSW', 'https://loodibee.com/wp-content/uploads/nba-golden-state-warriors-logo.png'),
('Houston Rockets', 'HOU', 'https://loodibee.com/wp-content/uploads/nba-houston-rockets-logo.png'),
('Indiana Pacers', 'IND', 'https://loodibee.com/wp-content/uploads/nba-indiana-pacers-logo.png'),
('LA Clippers', 'LAC', 'https://loodibee.com/wp-content/uploads/nba-la-clippers-logo.png'),
('Los Angeles Lakers', 'LAL', 'https://loodibee.com/wp-content/uploads/nba-los-angeles-lakers-logo.png'),
('Memphis Grizzlies', 'MEM', 'https://loodibee.com/wp-content/uploads/nba-memphis-grizzlies-logo.png'),
('Miami Heat', 'MIA', 'https://loodibee.com/wp-content/uploads/nba-miami-heat-logo.png'),
('Milwaukee Bucks', 'MIL', 'https://loodibee.com/wp-content/uploads/nba-milwaukee-bucks-logo.png'),
('Minnesota Timberwolves', 'MIN', 'https://loodibee.com/wp-content/uploads/nba-minnesota-timberwolves-logo.png'),
('New Orleans Pelicans', 'NOP', 'https://loodibee.com/wp-content/uploads/nba-new-orleans-pelicans-logo.png'),
('New York Knicks', 'NYK', 'https://loodibee.com/wp-content/uploads/nba-new-york-knicks-logo.png'),
('Oklahoma City Thunder', 'OKC', 'https://loodibee.com/wp-content/uploads/nba-oklahoma-city-thunder-logo.png'),
('Orlando Magic', 'ORL', 'https://loodibee.com/wp-content/uploads/nba-orlando-magic-logo.png'),
('Philadelphia 76ers', 'PHI', 'https://loodibee.com/wp-content/uploads/nba-philadelphia-76ers-logo.png'),
('Phoenix Suns', 'PHX', 'https://loodibee.com/wp-content/uploads/nba-phoenix-suns-logo.png'),
('Portland Trail Blazers', 'POR', 'https://loodibee.com/wp-content/uploads/nba-portland-trail-blazers-logo.png'),
('Sacramento Kings', 'SAC', 'https://loodibee.com/wp-content/uploads/nba-sacramento-kings-logo.png'),
('San Antonio Spurs', 'SAS', 'https://loodibee.com/wp-content/uploads/nba-san-antonio-spurs-logo.png'),
('Toronto Raptors', 'TOR', 'https://loodibee.com/wp-content/uploads/nba-toronto-raptors-logo.png'),
('Utah Jazz', 'UTA', 'https://loodibee.com/wp-content/uploads/nba-utah-jazz-logo.png'),
('Washington Wizards', 'WAS', 'https://loodibee.com/wp-content/uploads/nba-washington-wizards-logo.png');

ALTER TABLE teams ADD COLUMN logo_url TEXT;

UPDATE teams
SET logo_url = (
    SELECT logo_url
    FROM nba_team_flags
    WHERE nba_team_flags.abbreviation = teams.abbreviation
)
WHERE EXISTS (
    SELECT 1
    FROM nba_team_flags
    WHERE nba_team_flags.abbreviation = teams.abbreviation
);

DROP TABLE nba_team_flags;

UPDATE teams
SET logo_url = "https://1000logos.net/wp-content/uploads/2018/06/logo-Denver-Nuggets.png"
WHERE team_id = 1610612743;

-- Rename the existing table
ALTER TABLE teams RENAME TO teams_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY AUTOINCREMENT,
    abbreviation VARCHAR NOT NULL CHECK (length(abbreviation) = 3), -- Ensure abbreviation is 3 characters long
    nickname VARCHAR NOT NULL CHECK (length(trim(nickname)) > 0), -- Ensure nickname is not empty or only spaces
    name TEXT,
    year_founded TIMESTAMP,
    city_id INTEGER,
    arena_id INTEGER,
    owner TEXT,
    general_manager TEXT,
    headcoach TEXT,
    dleague_affiliation TEXT,
    facebook TEXT,
    instagram TEXT,
    twitter TEXT,
    logo_url TEXT,

    FOREIGN KEY (city_id) REFERENCES cities(city_id),
    FOREIGN KEY (arena_id) REFERENCES arenas(arena_id)
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO teams (team_id, abbreviation, nickname, name, year_founded, city_id, arena_id, owner, general_manager, headcoach, dleague_affiliation, facebook, instagram, twitter, logo_url)
SELECT
    team_id,
    abbreviation,
    nickname,
    name,
    year_founded,
    city_id,
    arena_id,
    owner,
    general_manager,
    headcoach,
    dleague_affiliation,
    facebook,
    instagram,
    twitter,
    logo_url
FROM teams_old
WHERE
    length(abbreviation) = 3 AND
    length(trim(nickname)) > 0;

-- Drop the old table
DROP TABLE teams_old;

-----------------------------------------------------------------
-- officials
-----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS officials(
    official_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR,
    last_name VARCHAR,
    jersey_num  INTEGER
);



ATTACH DATABASE '/Users/aliemre2023/Downloads/archive/nba.sqlite' AS nba_original;

INSERT INTO officials (official_id, first_name, last_name, jersey_num)
SELECT
    official_id,
    first_name,
    last_name,
    MIN(jersey_num) AS jersey_num
FROM
    nba_original.officials
GROUP BY
    official_id, first_name, last_name;
DETACH  DATABASE nba_original;

-- Rename the existing table
ALTER TABLE officials RENAME TO officials_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS officials (
    official_id INTEGER PRIMARY KEY AUTOINCREMENT CHECK (official_id > 0), -- Ensure official_id is positive
    first_name VARCHAR NOT NULL CHECK (length(trim(first_name)) > 0), -- Ensure first_name is not empty or only spaces
    last_name VARCHAR NOT NULL CHECK (length(trim(last_name)) > 0), -- Ensure last_name is not empty or only spaces
    jersey_num INTEGER CHECK (jersey_num > 0 AND jersey_num <= 99) -- Ensure jersey_num is between 1 and 99
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO officials (official_id, first_name, last_name, jersey_num)
SELECT
    official_id,
    first_name,
    last_name,
    jersey_num
FROM officials_old
WHERE
    official_id > 0 AND
    length(trim(first_name)) > 0 AND
    length(trim(last_name)) > 0 AND
    jersey_num > 0 AND
    jersey_num <= 99;

-- Drop the old table
DROP TABLE officials_old;

-----------------------------------------------------------------
-- players
-----------------------------------------------------------------
-- PLAYERS TABLE
CREATE TABLE IF NOT EXISTS players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    height TEXT,
    weight TEXT,
    birth_date TIMESTAMP,
    college VARCHAR,
    country_id INTEGER,

    FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE SET NULL
);

ATTACH DATABASE '/Users/aliemre2023/Downloads/archive/nba.sqlite' AS nba_original;

INSERT INTO players (player_id, first_name, last_name, height, weight, birth_date, college, country_id)
SELECT
    person_id,
    first_name,
    last_name,
    height,
    weight,
    birthdate,
    school,
    CASE country
        WHEN 'USA' THEN 184
        WHEN 'Lithuania' THEN 100
        WHEN 'Romania' THEN 141
        WHEN 'Congo' THEN 39
        WHEN 'Jamaica' THEN 83
        WHEN 'Serbia' THEN 152
        WHEN 'Croatia' THEN 42
        WHEN 'Italy' THEN 82
        WHEN 'United Kingdom' THEN 183
        WHEN 'Ukraine' THEN 181
        WHEN 'Canada' THEN 32
        WHEN 'Greece' THEN 66
        WHEN 'Estonia' THEN 55
        WHEN 'Australia' THEN 9
        WHEN 'US Virgin Islands' THEN 196
        WHEN 'Slovenia' THEN 157
        WHEN 'Nigeria' THEN 127
        WHEN 'Germany' THEN 64
        WHEN 'Turkey' THEN 177
        WHEN 'Dominican Republic' THEN 49
        WHEN 'Georgia' THEN 63
        WHEN 'Bosnia and Herzegovina' THEN 22
        WHEN 'Russia' THEN 142
        WHEN 'Argentina' THEN 7
        WHEN 'Belize' THEN 18
        WHEN 'France' THEN 60
        WHEN 'Senegal' THEN 151
        WHEN 'Mali' THEN 106
        WHEN 'Finland' THEN 59
        WHEN 'Puerto Rico' THEN 195
        WHEN 'Spain' THEN 162
        WHEN 'Haiti' THEN 72
        WHEN 'Venezuela' THEN 189
        WHEN 'Puerto RicoChina' THEN 36
        WHEN 'Czech Republic' THEN 45
        WHEN 'Scotland' THEN 194
        WHEN 'Poland' THEN 138
        WHEN 'Ireland' THEN 80
        WHEN 'Montenegro' THEN 116
        WHEN 'Brazil' THEN 24
        WHEN 'Latvia' THEN 94
        WHEN 'South Korea' THEN 90
        WHEN 'Belgium' THEN 17
        WHEN 'Norway' THEN 129
        WHEN 'South Sudan' THEN 161
        WHEN 'Uruguay' THEN 185
        WHEN 'Switzerland' THEN 167
        WHEN 'Tanzania' THEN 171
        WHEN 'Israel' THEN 81
        WHEN 'Sweden' THEN 166
        WHEN 'Bahamas' THEN 12
        WHEN 'DRC' THEN 40
        WHEN 'Mexico' THEN 111
        WHEN 'New Zealand' THEN 124
        WHEN 'Antigua and Barbuda' THEN 6
        WHEN 'Cabo Verde' THEN 29
        WHEN 'Tunisia' THEN 176
        WHEN 'Austria' THEN 10
        WHEN 'Cameroon' THEN 31
        WHEN 'Ghana' THEN 65
        WHEN 'Angola' THEN 5
        WHEN 'Japan' THEN 84
        WHEN 'Trinidad and Tobago' THEN 175
        WHEN 'Guinea' THEN 69
        WHEN 'Sudan' THEN 65
        WHEN 'Portugal' THEN 164
        WHEN 'Gabon' THEN 61
        WHEN 'Colombia' THEN 37
        WHEN 'Denmark' THEN 46
        ELSE NULL
    END AS country_id
FROM nba_original.common_player_info;

DETACH DATABASE nba_original;

ATTACH DATABASE '/Users/aliemre2023/Downloads/archive2/players.sqlite' AS player_images;

ALTER TABLE players
    ADD COLUMN png_name TEXT NOT NULL DEFAULT '';

UPDATE players
SET png_name = (
    SELECT images.playerid || '.png'
    FROM player_images.players AS images
    WHERE images.fname = players.first_name
      AND images.lname = players.last_name
)
WHERE EXISTS (
    SELECT 1
    FROM player_images.players AS images
    WHERE images.fname = players.first_name
      AND images.lname = players.last_name
);

DETACH DATABASE player_images;

-- convert kg
UPDATE players
SET weight = CAST(weight * 0.453592 AS INTEGER);

UPDATE players
SET height =
    CAST(
        (CAST(substr(height, 1, instr(height, '-') - 1) AS INTEGER) * 30.48 +
         CAST(substr(height, instr(height, '-') + 1) AS INTEGER) * 2.54)
    AS INTEGER);

-- Rename the existing table
ALTER TABLE players RENAME TO players_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS players (
    player_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR NOT NULL CHECK (length(trim(first_name)) > 0),
    last_name VARCHAR NOT NULL CHECK (length(trim(last_name)) > 0),
    height INTEGER CHECK (height >= 0),
    weight INTEGER CHECK (weight >= 0),
    birth_date TIMESTAMP CHECK (birth_date > '1900-01-01'),
    college VARCHAR,
    country_id INTEGER,
    png_name TEXT NOT NULL DEFAULT '',

    FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE SET NULL
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO players (player_id, first_name, last_name, height, weight, birth_date, college, country_id, png_name)
SELECT
    player_id,
    first_name,
    last_name,
    CASE WHEN height > 0 THEN CAST(height AS INTEGER) ELSE NULL END,
    CASE WHEN weight > 0 THEN CAST(weight AS INTEGER) ELSE NULL END,
    birth_date,
    college,
    country_id,
    png_name
FROM players_old
WHERE
    length(trim(first_name)) > 0 AND
    length(trim(last_name)) > 0 AND
    height > 0 AND
    weight > 0 AND
    birth_date > '1900-01-01';

-- Drop the old table
DROP TABLE players_old;



-----------------------------------------------------------------
-- quotes
-----------------------------------------------------------------
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS quotes (
    quote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    quote TEXT,
    FOREIGN KEY (player_id) REFERENCES players(player_id)
        ON DELETE CASCADE
);

INSERT INTO quotes (player_id, quote)
VALUES (2738, "I like stick deodorant. I'm not a huge fan of spritz."),
       (2738, "As long as I keep working hard, the sky will be the limit."),
       (202711, "Time flies. Especially when you have a great time, when you''re winning and the team is playing great."),
       (203999, "My teams in Serbia always had really good point guards. But I have always loved to dribble the ball. Even when I was outside, just walking by myself, I would always love to dribble and imagine my defender there in front of me - what I would try to do."),
       (2, "Unlike last year, we’re not just happy to be here in the Finals.");

-- Rename the existing table
ALTER TABLE quotes RENAME TO quotes_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS quotes (
    quote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    quote TEXT CHECK (length(trim(quote)) > 0), -- Ensure the quote is not empty
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO quotes (quote_id, player_id, quote)
SELECT
    quote_id,
    player_id,
    quote
FROM quotes_old
WHERE length(trim(quote)) > 0;

-- Drop the old table
DROP TABLE quotes_old;

PRAGMA foreign_keys = OFF;
-----------------------------------------------------------------
-- player_infos
-----------------------------------------------------------------
ATTACH DATABASE '/Users/aliemre2023/Downloads/archive/nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS player_infos (
    --stat_id INTEGER PRIMARY KEY,
    player_id INTEGER,
    team_id INTEGER,
    is_active INTEGER,
    position INTEGER,
    from_year INTEGER,
    to_year INTEGER,
    jersey INTEGER,
    season_exp INTEGER,

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

INSERT INTO player_infos (player_id, team_id, is_active, position, from_year, to_year, jersey, season_exp)
SELECT
    cpi.person_id,
    cpi.team_id,
    p.is_active,
    cpi.position,
    cpi.from_year,
    cpi.to_year,
    cpi.jersey,
    cpi.season_exp
FROM
    nba_original.common_player_info cpi
JOIN
    nba_original.player p
ON
    cpi.person_id = p.id;

DETACH DATABASE nba_original;

-- Rename the existing table
ALTER TABLE player_infos RENAME TO player_infos_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS player_infos (
    player_id INTEGER,
    team_id INTEGER,
    is_active INTEGER CHECK (is_active IN (0,1)),
    position INTEGER,
    from_year INTEGER CHECK (from_year > 1900),
    to_year INTEGER CHECK (to_year >= from_year),
    jersey INTEGER CHECK (jersey >= 0), -- Ensure jersey is non-negative
    season_exp INTEGER CHECK (season_exp >= 0),

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO player_infos (player_id, team_id, is_active, position, from_year, to_year, jersey, season_exp)
SELECT
    player_id,
    team_id,
    CASE
        WHEN is_active IN (0, 1) THEN is_active
        ELSE NULL
    END,
    position,
    CASE
        WHEN from_year > 1900 THEN from_year
        ELSE NULL
    END,
    CASE
        WHEN to_year >= from_year THEN to_year
        ELSE NULL
    END,
    COALESCE(jersey, 0),
    CASE
        WHEN season_exp >= 0 THEN season_exp
        ELSE NULL
    END
FROM player_infos_old
WHERE
    is_active IN (0, 1) AND
    from_year > 1900 AND
    to_year >= from_year AND
    season_exp >= 0;

-- Drop the old table
DROP TABLE player_infos_old;

-----------------------------------------------------------------
-- drafts
-----------------------------------------------------------------
ATTACH DATABASE '/Users/aliemre2023/Downloads/archive/nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS drafts (
    draft_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    team_id INTEGER,
    season INTEGER,
    overall_pick INTEGER,
    position VARCHAR,

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

INSERT INTO drafts (player_id, team_id, season, overall_pick, position)
SELECT
    dcs.player_id,
    dh.team_id,
    dh.season,
    dh.overall_pick,
    dcs.position

FROM
    nba_original.draft_history dh
JOIN
    nba_original.draft_combine_stats dcs ON dh.person_id = dcs.player_id
JOIN
    players p ON dcs.player_id = p.player_id
JOIN
    teams t ON dh.team_id = t.team_id;

DETACH DATABASE nba_original;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS drafts (
    draft_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    team_id INTEGER,
    season INTEGER,
    overall_pick INTEGER CHECK (overall_pick > 0), -- Ensure overall pick is positive
    position VARCHAR CHECK (position IN ('PG', 'SG', 'SF', 'PF', 'C')), -- Validate position

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO drafts (player_id, team_id, season, overall_pick, position)
SELECT
    player_id,
    team_id,
    season,
    overall_pick,
    position
FROM drafts
WHERE
    overall_pick > 0 AND
    position IN ('PG', 'SG', 'SF', 'PF', 'C');


-----------------------------------------------------------------
-- games
-----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS games(
    game_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE,
    home_team_id INTEGER,
    away_team_id INTEGER,
    official_id INTEGER,

    FOREIGN KEY (home_team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    FOREIGN KEY (official_id) REFERENCES officials(official_id) ON DELETE SET NULL
);

ATTACH DATABASE '/Users/aliemre2023/Downloads/archive/nba.sqlite' AS nba_original;

INSERT INTO games (game_id, date, home_team_id, away_team_id, official_id)
SELECT
    g.game_id,
    g.game_date,
    g.team_id_home,
    g.team_id_away,
    MIN(o.official_id) AS official_id
FROM
    nba_original.game AS g
LEFT JOIN
    nba_original.officials AS o ON g.game_id = o.game_id
GROUP BY
    g.game_id, g.game_date, g.team_id_home, g.team_id_away;

DETACH DATABASE nba_original;

-- Rename the existing table
ALTER TABLE games RENAME TO games_old;

-- Create the new table with the same structure
CREATE TABLE IF NOT EXISTS games (
    game_id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE,
    home_team_id INTEGER,
    away_team_id INTEGER,
    official_id INTEGER,

    FOREIGN KEY (home_team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id) ON DELETE SET NULL,
    FOREIGN KEY (official_id) REFERENCES officials(official_id) ON DELETE SET NULL
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO games (game_id, date, home_team_id, away_team_id, official_id)
SELECT
    game_id,
    date,
    home_team_id,
    away_team_id,
    official_id
FROM games_old;

-- Drop the old table
DROP TABLE games_old;

-----------------------------------------------------------------
-- game_stats
-----------------------------------------------------------------
ATTACH DATABASE '/Users/aliemre2023/Downloads/archive/nba.sqlite' AS nba_original;

CREATE TABLE IF NOT EXISTS game_stats (
    game_id INTEGER,
    season INTEGER,
    home_team_score INTEGER,
    away_team_score INTEGER,
    home_qtr1_points INTEGER,
    home_qtr2_points INTEGER,
    home_qtr3_points INTEGER,
    home_qtr4_points INTEGER,
    away_qtr1_points INTEGER,
    away_qtr2_points INTEGER,
    away_qtr3_points INTEGER,
    away_qtr4_points INTEGER,
    home_rebounds INTEGER,
    home_blocks INTEGER,
    home_steals INTEGER,
    away_rebounds INTEGER,
    away_blocks INTEGER,
    away_steals INTEGER,

    FOREIGN KEY (game_id) REFERENCES games (game_id)
);

INSERT INTO game_stats (game_id, season, home_team_score, away_team_score, home_qtr1_points, home_qtr2_points,
                        home_qtr3_points, home_qtr4_points, away_qtr1_points, away_qtr2_points, away_qtr3_points,
                        away_qtr4_points, home_rebounds, home_blocks, home_steals, away_rebounds, away_blocks,
                        away_steals)
SELECT
    g.game_id,
    sum.season,
    scores.pts_home,
    scores.pts_away,
    scores.pts_qtr1_home,
    scores.pts_qtr2_home,
    scores.pts_qtr3_home,
    scores.pts_qtr4_home,
    scores.pts_qtr1_away,
    scores.pts_qtr2_away,
    scores.pts_qtr3_away,
    scores.pts_qtr4_away,
    game.reb_home,
    game.blk_home,
    game.stl_home,
    game.reb_away,
    game.blk_away,
    game.stl_away

FROM
    nba_original.game_summary sum
JOIN
    nba_original.game game ON sum.game_id = game.game_id
JOIN
    nba_original.line_score scores on game.game_id = scores.game_id
JOIN
    games g ON scores.game_id = g.game_id;

DETACH DATABASE nba_original;


-- Rename the existing table
ALTER TABLE game_stats RENAME TO game_stats_old;

-- Create the new table with data validations
CREATE TABLE IF NOT EXISTS game_stats (
    game_id INTEGER,
    season INTEGER,
    home_team_score INTEGER CHECK (home_team_score >= 0) DEFAULT 0,
    away_team_score INTEGER CHECK (away_team_score >= 0) DEFAULT 0,
    home_qtr1_points INTEGER CHECK (home_qtr1_points >= 0) DEFAULT 0,
    home_qtr2_points INTEGER CHECK (home_qtr2_points >= 0) DEFAULT 0,
    home_qtr3_points INTEGER CHECK (home_qtr3_points >= 0) DEFAULT 0,
    home_qtr4_points INTEGER CHECK (home_qtr4_points >= 0) DEFAULT 0,
    away_qtr1_points INTEGER CHECK (away_qtr1_points >= 0) DEFAULT 0,
    away_qtr2_points INTEGER CHECK (away_qtr2_points >= 0) DEFAULT 0,
    away_qtr3_points INTEGER CHECK (away_qtr3_points >= 0) DEFAULT 0,
    away_qtr4_points INTEGER CHECK (away_qtr4_points >= 0) DEFAULT 0,
    home_rebounds INTEGER CHECK (home_rebounds >= 0) DEFAULT 0,
    home_blocks INTEGER CHECK (home_blocks >= 0) DEFAULT 0,
    home_steals INTEGER CHECK (home_steals >= 0) DEFAULT 0,
    away_rebounds INTEGER CHECK (away_rebounds >= 0) DEFAULT 0,
    away_blocks INTEGER CHECK (away_blocks >= 0) DEFAULT 0,
    away_steals INTEGER CHECK (away_steals >= 0) DEFAULT 0,

    FOREIGN KEY (game_id) REFERENCES games (game_id)
);

-- Insert data from the old table to the new table, handling potential violations
INSERT INTO game_stats (game_id, season, home_team_score, away_team_score, home_qtr1_points, home_qtr2_points, home_qtr3_points, home_qtr4_points,
                       away_qtr1_points, away_qtr2_points, away_qtr3_points, away_qtr4_points, home_rebounds, home_blocks, home_steals,
                       away_rebounds, away_blocks, away_steals)
SELECT
    game_id,
    season,
    COALESCE(home_team_score, 0),
    COALESCE(away_team_score, 0),
    COALESCE(home_qtr1_points, 0),
    COALESCE(home_qtr2_points, 0),
    COALESCE(home_qtr3_points, 0),
    COALESCE(home_qtr4_points, 0),
    COALESCE(away_qtr1_points, 0),
    COALESCE(away_qtr2_points, 0),
    COALESCE(away_qtr3_points, 0),
    COALESCE(away_qtr4_points, 0),
    COALESCE(home_rebounds, 0),
    COALESCE(home_blocks, 0),
    COALESCE(home_steals, 0),
    COALESCE(away_rebounds, 0),
    COALESCE(away_blocks, 0),
    COALESCE(away_steals, 0)
FROM game_stats_old
WHERE
    home_team_score >= 0 AND
    away_team_score >= 0 AND
    home_qtr1_points >= 0 AND
    home_qtr2_points >= 0 AND
    home_qtr3_points >= 0 AND
    home_qtr4_points >= 0 AND
    away_qtr1_points >= 0 AND
    away_qtr2_points >= 0 AND
    away_qtr3_points >= 0 AND
    away_qtr4_points >= 0 AND
    home_rebounds >= 0 AND
    home_blocks >= 0 AND
    home_steals >= 0 AND
    away_rebounds >= 0 AND
    away_blocks >= 0 AND
    away_steals >= 0;

-- Drop the old table
DROP TABLE game_stats_old;